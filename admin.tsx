
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
// Using the same credentials as the main application
const SUPABASE_URL = 'https://zpjnzpcsnxltqocuhdse.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwam56cGNzbnhsdHFvY3VoZHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzIxMjMsImV4cCI6MjA3NTQwODEyM30.-13qfDagcl0EcshaCIoiB85dKEGaH-ZWDGyToqaL74M';

let supabase: SupabaseClient;
try {
    if (!SUPABASE_URL.includes('YOUR_SUPABASE') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')) {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase no configurado.");
    }
} catch (error) {
    console.error("Error inicializando Supabase:", error);
}

// --- ESTRUCTURA DE DATOS (TIPOS) ---
type OrderStatus = 'pendiente' | 'en_preparacion' | 'enviado' | 'entregado' | 'cancelado';

type Order = {
    id: number;
    numero_pedido: string;
    nombre_cliente: string;
    telefono_cliente: string;
    direccion: string;
    total: number;
    created_at: string;
    estado: OrderStatus;
    items: OrderItem[];
};

type OrderItem = {
    id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    productos: {
        nombre: string;
    };
};

// --- COMPONENTE PRINCIPAL ---
const AdminApp = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();

        // Set up real-time updates for any changes in the 'pedidos' table
        const channel = supabase
            .channel('pedidos-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, (payload) => {
                console.log('Cambio detectado en pedidos:', payload);
                fetchOrders(); // Re-fetch all orders to keep the view updated
            })
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchOrders() {
        if (!supabase) {
            setError("Supabase no está configurado.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Fetch orders and their related items with product names
            const { data, error } = await supabase
                .from('pedidos')
                .select(`
                    id,
                    numero_pedido,
                    nombre_cliente,
                    telefono_cliente,
                    direccion,
                    total,
                    created_at,
                    estado,
                    pedido_items (
                        id,
                        producto_id,
                        cantidad,
                        precio_unitario,
                        productos ( nombre )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            // Map data to match Order and OrderItem types
            const mappedData: Order[] = data.map((order: any) => ({
                ...order,
                items: order.pedido_items || [],
            }));

            setOrders(mappedData);
        } catch (err: any) {
            console.error("Error al cargar pedidos:", err);
            setError("No se pudo cargar la lista de pedidos.");
        } finally {
            setLoading(false);
        }
    }
    
    async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from('pedidos')
                .update({ estado: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            // The real-time subscription will handle the UI update automatically.
        } catch (err) {
            console.error("Error al actualizar estado del pedido:", err);
            alert("No se pudo actualizar el estado del pedido.");
        }
    }

    if (loading) {
        return <div className="loader">Cargando pedidos...</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="admin-container">
            <header>
                <h1>Panel de Administración de Pedidos</h1>
            </header>
            <main>
                <div className="orders-list">
                    {orders.length === 0 ? (
                        <p>No hay pedidos para mostrar.</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className={`order-card status-${order.estado}`}>
                                <div className="order-header">
                                    <h3>Pedido #{order.numero_pedido}</h3>
                                    <span className="order-status">{order.estado || 'pendiente'}</span>
                                </div>
                                <div className="order-body">
                                    <p><strong>Cliente:</strong> {order.nombre_cliente}</p>
                                    <p><strong>Dirección:</strong> {order.direccion}</p>
                                    <p><strong>Teléfono:</strong> {order.telefono_cliente}</p>
                                    <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString('es-PE')}</p>
                                    <p><strong>Total:</strong> S/{(order.total || 0).toFixed(2)}</p>
                                    <h4>Items:</h4>
                                    <ul>
                                        {order.items.map(item => (
                                            <li key={item.id}>
                                                {item.cantidad}x {item.productos?.nombre || 'Producto no encontrado'} (S/{(item.precio_unitario || 0).toFixed(2)})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="order-actions">
                                    <label>Cambiar estado: </label>
                                    <select 
                                        value={order.estado} 
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_preparacion">En Preparación</option>
                                        <option value="enviado">Enviado</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};


// --- INICIALIZACIÓN DE REACT ---
// Assumes an element with id="admin-root" exists in the corresponding HTML file.
const container = document.getElementById('admin-root');
if (container) {
    const root = createRoot(container);
    root.render(<AdminApp />);
}

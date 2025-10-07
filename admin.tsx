import React, { useState, useEffect, FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
const SUPABASE_URL = 'https://zpjnzpcsnxltqocuhdse.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwam56cGNzbnhsdHFvY3VoZHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzIxMjMsImV4cCI6MjA3NTQwODEyM30.-13qfDagcl0EcshaCIoiB85dKEGaH-ZWDGyToqaL74M';

let supabase: SupabaseClient;
try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error("Error inicializando Supabase:", error);
}

// --- ESTRUCTURA DE DATOS (TIPOS) ---
type OrderStatus = 'Recibido' | 'En preparación' | 'Listo' | 'Entregado' | 'Cancelado';

type Order = {
    id: number;
    numero_pedido: string;
    nombre_cliente: string;
    telefono_cliente: string;
    direccion: string | null;
    total: number;
    created_at: string;
    estado: OrderStatus;
    items: OrderItem[];
};

type OrderItem = {
    id: number;
    cantidad: number;
    precio_unitario: number;
    productos: {
        nombre: string;
    };
};


// --- COMPONENTES DE LA UI ---

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                // Lanzamos el error para que sea capturado por el bloque catch
                throw signInError;
            }
            // Si no hay error, el onAuthStateChange se encargará de redirigir.
        } catch (err: any) {
            console.error('Login Error Object:', err);
            // Mostramos el mensaje de error real de Supabase
            setError(err.message || 'Ocurrió un error inesperado. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Pedidos51</h1>
                <p>Acceso al panel de administración</p>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

const Dashboard = ({ user }: { user: User }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();

        const channel = supabase
            .channel('pedidos-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchOrders() {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pedidos')
                .select(`*, pedido_items(*, productos(nombre))`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            const mappedData: Order[] = data.map((order: any) => ({
                ...order,
                items: order.pedido_items || [],
            }));
            setOrders(mappedData);
        } catch (err: any) {
            setError("No se pudo cargar los pedidos. Revisa los permisos (RLS).");
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
        try {
            const { error } = await supabase
                .from('pedidos')
                .update({ estado: newStatus })
                .eq('id', orderId);
            if (error) throw error;
        } catch (err) {
            alert("Error al actualizar el estado del pedido.");
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };
    
    // Función para normalizar el estado para usarlo en clases CSS
    const getStatusClassName = (status: string | undefined | null) => {
        if (!status) return 'Recibido';
        return status
            .normalize("NFD") // Separa acentos de las letras
            .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
            .replace(/ /g, '_'); // Reemplaza espacios con guiones bajos
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panel de Pedidos</h1>
                <div className="user-info">
                    <span>{user.email}</span>
                    <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </header>
            <main>
                {loading && <div className="loader">Cargando pedidos...</div>}
                {error && <div className="error-message">{error}</div>}
                {!loading && !error && (
                    <div className="orders-grid">
                        {orders.length === 0 ? (
                            <p>No hay pedidos para mostrar.</p>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className={`order-card status-${getStatusClassName(order.estado)}`}>
                                    <div className="order-header">
                                        <h3>Pedido #{order.numero_pedido}</h3>
                                        <span className="order-status">{order.estado || 'Recibido'}</span>
                                    </div>
                                    <div className="order-body">
                                        <p><strong>Cliente:</strong> {order.nombre_cliente}</p>
                                        <p><strong>Dirección:</strong> {order.direccion || 'Sin dirección'}</p>
                                        <p><strong>Teléfono:</strong> {order.telefono_cliente}</p>
                                        <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString('es-PE')}</p>
                                        <p><strong>Total:</strong> S/{(order.total || 0).toFixed(2)}</p>
                                        <h4>Items:</h4>
                                        <ul>
                                            {order.items.map(item => (
                                                <li key={item.id}>
                                                    {item.cantidad}x {item.productos?.nombre || '?'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="order-actions">
                                        <select
                                            value={order.estado}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                        >
                                            <option value="Recibido">Recibido</option>
                                            <option value="En preparación">En Preparación</option>
                                            <option value="Listo">Listo</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL (REFACTORIZADO) ---
const AdminApp = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChange se dispara inmediatamente con el estado de la sesión inicial
        // y luego escucha los cambios de inicio/cierre de sesión.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false); // Una vez que tenemos el estado, dejamos de cargar.
        });

        // Limpiamos la suscripción cuando el componente se desmonta.
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (!supabase) {
        return <div>Error: Supabase no se pudo inicializar.</div>;
    }

    // Mostramos un cargador mientras se verifica la sesión inicial.
    if (loading) {
        return <div className="loader">Verificando sesión...</div>;
    }

    // Si no hay sesión, mostramos el componente de Login.
    if (!session) {
        return <LoginComponent />;
    } 
    // Si hay una sesión, mostramos el Dashboard.
    else {
        return <Dashboard user={session.user} />;
    }
};


// --- INICIALIZACIÓN DE REACT ---
const container = document.getElementById('admin-root');
if (container) {
    const root = createRoot(container);
    root.render(<AdminApp />);
}
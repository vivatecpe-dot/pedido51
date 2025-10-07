import React from 'react';
import { createRoot } from 'react-dom/client';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
// Reemplaza con la URL y la clave anónima de tu proyecto de Supabase
const SUPABASE_URL = 'https://zpjnzpcsnxltqocuhdse.supabase.co'; // Pega tu URL aquí
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwam56cGNzbnhsdHFvY3VoZHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzIxMjMsImV4cCI6MjA3NTQwODEyM30.-13qfDagcl0EcshaCIoiB85dKEGaH-ZWDGyToqaL74M'; // Pega tu clave anónima aquí

let supabase: SupabaseClient;
try {
    if (!SUPABASE_URL.includes('YOUR_SUPABASE') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')) {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase no configurado. El dashboard no funcionará.");
    }
} catch (error) {
    console.error("Error inicializando Supabase:", error);
}

// --- ESTRUCTURA DE DATOS (TIPOS) ---
type Order = {
    id: number;
    numero_pedido: string;
    nombre_cliente: string;
    direccion: string;
    total: number;
    estado: 'Recibido' | 'En preparación' | 'Listo' | 'Entregado';
    created_at: string;
};

// --- DOM ELEMENTS ---
const ordersTableBody = document.getElementById('orders-table-body') as HTMLElement;
const loaderContainer = document.getElementById('loader-container') as HTMLElement;
const noOrdersMessage = document.getElementById('no-orders-message') as HTMLElement;

// --- STATE ---
let orders: Order[] = [];
let ordersSubscription: RealtimeChannel | null = null;

// --- RENDER FUNCTIONS ---
function renderOrders() {
    loaderContainer.style.display = 'none';

    if (orders.length === 0) {
        noOrdersMessage.style.display = 'block';
        ordersTableBody.innerHTML = '';
    } else {
        noOrdersMessage.style.display = 'none';
        ordersTableBody.innerHTML = orders
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Ordenar por más reciente
            .map(order => `
                <tr id="order-${order.id}">
                    <td><strong>${order.numero_pedido}</strong></td>
                    <td>${order.nombre_cliente}</td>
                    <td>${order.direccion || 'No especificada'}</td>
                    <td>S/${order.total.toFixed(2)}</td>
                    <td><span class="status status-${order.estado.toLowerCase().replace(' ', '')}">${order.estado}</span></td>
                    <td>${new Date(order.created_at).toLocaleString('es-PE')}</td>
                    <td>
                        <button data-order-id="${order.id}">Ver</button>
                    </td>
                </tr>
            `).join('');
    }
}

// --- SUPABASE FUNCTIONS ---
async function fetchInitialOrders() {
    if (!supabase) {
        console.error("Supabase no está disponible.");
        orders = [];
        renderOrders();
        return;
    }

    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            // Este error es esperado si RLS está activo y el usuario no está logueado
            console.warn("Error al obtener pedidos (puede ser por RLS):", error.message);
            orders = [];
        } else {
            orders = data as Order[];
        }
    } catch (e) {
        console.error("Error crítico al obtener pedidos:", e);
        orders = [];
    }
    renderOrders();
}

function subscribeToOrderChanges() {
    if (!supabase) return;

    if (ordersSubscription) {
        ordersSubscription.unsubscribe();
    }

    ordersSubscription = supabase
        .channel('public:pedidos')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'pedidos' },
            (payload) => {
                console.log('Nuevo pedido recibido:', payload.new);
                const newOrder = payload.new as Order;
                // Añadir al principio del array para que aparezca arriba
                orders.unshift(newOrder);
                renderOrders();
            }
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'pedidos' },
            (payload) => {
                console.log('Pedido actualizado:', payload.new);
                const updatedOrder = payload.new as Order;
                const index = orders.findIndex(o => o.id === updatedOrder.id);
                if (index !== -1) {
                    orders[index] = updatedOrder;
                    renderOrders();
                }
            }
        )
        .subscribe();
    
    console.log("Suscrito a cambios en la tabla de pedidos.");
}


// --- INITIALIZATION ---
async function init() {
    await fetchInitialOrders();
    subscribeToOrderChanges();
    // Aquí es donde en el futuro llamaremos a una función para verificar la sesión del usuario
    // checkUserSession(); 
}

// Asegúrate de que Supabase esté configurado antes de iniciar
if (supabase) {
    init();
} else {
    loaderContainer.innerHTML = '<p>Error: La configuración de Supabase no es válida.</p>';
}

// React entry point - not used for app logic, but required by the environment.
const App = () => {
  return null;
};

const container = document.getElementById('app-root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

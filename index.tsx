import React from 'react';
import { createRoot } from 'react-dom/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
// Reemplaza con la URL y la clave anónima de tu proyecto de Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Pega tu URL aquí
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Pega tu clave anónima aquí

let supabase: SupabaseClient;
try {
    if (!SUPABASE_URL.includes('YOUR_SUPABASE') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')) {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase no configurado. Mostrando datos de ejemplo.");
    }
} catch (error) {
    console.error("Error inicializando Supabase:", error);
}

// --- ESTRUCTURA DE DATOS (TIPOS) ---
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isMostOrdered?: boolean;
};

type Category = {
  id: number;
  name: string;
  icon: string;
  products: Product[];
};

type CartItem = Product & {
  quantity: number;
};

type Promo = {
    id: number;
    title: string;
    description: string;
    image: string;
}

// --- DATOS LOCALES DE EJEMPLO (si Supabase falla) ---
const localPromosData: Promo[] = [
    { id: 1, title: 'Combo Clásico', description: 'Hamburguesa + Papas + Bebida', image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'},
];
const localMenuData: Category[] = [
    {
        id: 1,
        name: 'Hamburguesas',
        icon: '🍔',
        products: [
            { id: 101, name: 'Clásica', description: 'Carne, lechuga, tomate', price: 15.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: true },
            { id: 102, name: 'Doble Queso', description: 'Doble carne, doble queso', price: 22.00, image: 'https://images.unsplash.com/photo-1603064752734-4b42eff72dca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: false },
            { id: 103, name: 'Criolla', description: 'Con Huevo y Plátano', price: 20.00, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: false },
        ]
    },
    {
        id: 2,
        name: 'Pizzas',
        icon: '🍕',
        products: [
            { id: 201, name: 'Margarita', description: 'Salsa, mozzarella, albahaca', price: 25.00, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: false },
            { id: 202, name: 'Pepperoni', description: 'Clásica de pepperoni', price: 30.00, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: true },
        ]
    },
    {
        id: 3,
        name: 'Bebidas',
        icon: '🥤',
        products: [
            { id: 301, name: 'Gaseosa', description: 'Botella de 500ml', price: 5.00, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: false },
            { id: 302, name: 'Jugo Natural', description: 'Jugo de frutas de estación', price: 8.00, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: true },
        ]
    },
     {
        id: 4,
        name: 'Postres',
        icon: '🍰',
        products: [
            { id: 401, name: 'Torta de Chocolate', description: 'Tajada de torta húmeda', price: 12.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isMostOrdered: true },
        ]
    }
];
let menuData: Category[] = [];
let promosData: Promo[] = localPromosData;

// --- STATE ---
let state: {
  selectedCategoryId: number;
  cart: CartItem[];
  currentView: 'home' | 'products';
} = {
  selectedCategoryId: 0,
  cart: [],
  currentView: 'home',
};

// --- DOM ELEMENTS ---
const loaderOverlay = document.getElementById('loader-overlay') as HTMLElement;
const homeView = document.getElementById('home-view') as HTMLElement;
const productsView = document.getElementById('products-view') as HTMLElement;
const promosContainer = document.getElementById('promos-container') as HTMLElement;
const mostOrderedContainer = document.getElementById('most-ordered-container') as HTMLElement;
const categoriesGridContainer = document.getElementById('categories-grid-container') as HTMLElement;
const backToHomeBtn = document.getElementById('back-to-home-btn') as HTMLElement;
const productViewTitle = document.getElementById('product-view-title') as HTMLElement;
const categoriesContainer = document.getElementById('categories-container') as HTMLElement;
const productsGrid = document.getElementById('products-grid') as HTMLElement;
const cartBadgeContainer = document.getElementById('cart-badge-container') as HTMLElement;
const cartItemsContainer = document.getElementById('cart-items-container') as HTMLElement;
const cartTotalPriceEl = document.getElementById('cart-total-price') as HTMLElement;
const cartPanel = document.getElementById('cart-panel') as HTMLElement;
const cartOverlay = document.getElementById('cart-overlay') as HTMLElement;
const closeCartBtn = document.getElementById('close-cart-btn') as HTMLElement;
const navCartBtn = document.getElementById('nav-cart') as HTMLElement;
const navHomeBtn = document.getElementById('nav-home') as HTMLElement;
const checkoutBtn = document.getElementById('checkout-btn') as HTMLElement;
const checkoutModal = document.getElementById('checkout-modal') as HTMLElement;
const closeCheckoutModalBtn = document.getElementById('close-checkout-modal-btn') as HTMLElement;
const checkoutForm = document.getElementById('checkout-form') as HTMLFormElement;
const successModal = document.getElementById('success-modal') as HTMLElement;
const closeSuccessModalBtn = document.getElementById('close-success-modal-btn') as HTMLElement;
const printTicketBtn = document.getElementById('print-ticket-btn') as HTMLElement;


// --- RENDER FUNCTIONS ---
function renderPromos() {
    promosContainer.innerHTML = promosData.map(promo => `
        <div class="promo-card">
            <img src="${promo.image}" alt="${promo.title}" loading="lazy">
            <div class="overlay">
                <h3>${promo.title}</h3>
                <p>${promo.description}</p>
            </div>
        </div>
    `).join('');
}

function renderMostOrdered() {
    const mostOrdered = menuData.flatMap(c => c.products).filter(p => p.isMostOrdered);
    mostOrderedContainer.innerHTML = mostOrdered.map(product => `
        <div class="most-ordered-card" data-product-id="${product.id}">
             <img src="${product.image}" alt="${product.name}" loading="lazy">
             <p class="name">${product.name}</p>
             <p class="price">S/${product.price.toFixed(2)}</p>
        </div>
    `).join('');
}

function renderCategoryGrid() {
    categoriesGridContainer.innerHTML = menuData.map(category => `
        <div class="category-card" data-category-id="${category.id}">
            <div class="icon">${category.icon}</div>
            <div class="name">${category.name}</div>
        </div>
    `).join('');
}

function renderCategoriesFilter() {
  categoriesContainer.innerHTML = menuData.map(category => `
    <div class="category-chip ${state.selectedCategoryId === category.id ? 'active' : ''}" data-category-id="${category.id}">
      ${category.name}
    </div>
  `).join('');
}

function renderProducts() {
  productsGrid.innerHTML = '';
  const category = menuData.find(c => c.id === state.selectedCategoryId);
  if (!category) return;

  productViewTitle.textContent = category.name;
  productsGrid.innerHTML = category.products.map(product => `
      <div class="product-card" data-product-id="${product.id}">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-footer">
            <p class="product-price">S/${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-product-id="${product.id}">+</button>
          </div>
      </div>
    `).join('');
}

function renderCart() {
    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    } else {
        cartItemsContainer.innerHTML = state.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">S/${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase">+</button>
                </div>
            </div>
        `).join('');
    }
    
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalPriceEl.textContent = `S/${total.toFixed(2)}`;
    updateCartBadge();
}

function updateCartBadge() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    cartBadgeContainer.innerHTML = `<div class="cart-badge">${totalItems}</div>`;
  } else {
    cartBadgeContainer.innerHTML = '';
  }
}

// --- VIEW MANAGEMENT ---
function renderApp() {
    if (state.currentView === 'home') {
        homeView.classList.add('active');
        productsView.classList.remove('active');
        renderHomeScreen();
    } else {
        homeView.classList.remove('active');
        productsView.classList.add('active');
        renderProductsScreen();
    }
    renderCart();
}

function renderHomeScreen() {
    renderPromos();
    renderMostOrdered();
    renderCategoryGrid();
}

function renderProductsScreen() {
    renderCategoriesFilter();
    renderProducts();
}


// --- EVENT HANDLERS & LOGIC ---
function addToCart(productId: number) {
  const existingItem = state.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const productToAdd = menuData.flatMap(c => c.products).find(p => p.id === productId);
    if (productToAdd) {
      state.cart.push({ ...productToAdd, quantity: 1 });
    }
  }
  renderCart();
}

function updateQuantity(productId: number, action: 'increase' | 'decrease') {
    const item = state.cart.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity++;
    } else if (action === 'decrease') {
        item.quantity--;
        if (item.quantity <= 0) {
            state.cart = state.cart.filter(cartItem => cartItem.id !== productId);
        }
    }
    renderCart();
}

function handleCategoryGridClick(event: Event) {
    const target = event.target as HTMLElement;
    const card = target.closest('.category-card');
    if (card instanceof HTMLElement && card.dataset.categoryId) {
        state.selectedCategoryId = Number(card.dataset.categoryId);
        state.currentView = 'products';
        renderApp();
    }
}

function handleCategoryFilterClick(event: Event) {
    const target = event.target as HTMLElement;
    const chip = target.closest('.category-chip');
    if (chip instanceof HTMLElement && chip.dataset.categoryId) {
        state.selectedCategoryId = Number(chip.dataset.categoryId);
        renderProductsScreen();
    }
}

function handleProductGridClick(event: Event) {
    const target = event.target as HTMLElement;
    const button = target.closest('.add-to-cart-btn');
    if (button instanceof HTMLElement && button.dataset.productId) {
        addToCart(Number(button.dataset.productId));
    }
}

function handleCartItemsClick(event: Event) {
    const target = event.target as HTMLElement;
    const button = target.closest('.quantity-btn');
    if (button instanceof HTMLElement) {
        const itemEl = target.closest('.cart-item');
        if (itemEl instanceof HTMLElement && itemEl.dataset.productId) {
            const productId = Number(itemEl.dataset.productId);
            const action = button.dataset.action as 'increase' | 'decrease';
            updateQuantity(productId, action);
        }
    }
}

function handleGoHome() {
    state.currentView = 'home';
    renderApp();
}

function toggleCart(visible: boolean) {
    cartPanel.classList.toggle('visible', visible);
    cartOverlay.classList.toggle('visible', visible);
}

function toggleModal(modal: HTMLElement, visible: boolean) {
    modal.classList.toggle('visible', visible);
}

function showLoader(visible: boolean) {
    loaderOverlay.classList.toggle('hidden', !visible);
}

// --- SUCCESS & PRINTING ---
function showSuccessScreen(orderNumber: string, customerName: string, cart: CartItem[], total: number) {
    const successSummaryContainer = document.getElementById('success-order-summary') as HTMLElement;
    const printableTicketContainer = document.getElementById('printable-ticket') as HTMLElement;

    const summaryHtml = `
        <h4>Pedido: ${orderNumber}</h4>
        <p>Cliente: ${customerName}</p>
        <hr>
        ${cart.map(item => `
            <div class="summary-item">
                <span>${item.quantity}x ${item.name}</span>
                <span>S/${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <hr>
        <div class="summary-total">
            <span>Total</span>
            <span>S/${total.toFixed(2)}</span>
        </div>
    `;

    const ticketHtml = `
        <div class="ticket-header">
            <h3>Pedidos51</h3>
            <p>Comanda de Cocina</p>
            <p>${new Date().toLocaleString('es-PE')}</p>
            <hr class="ticket-divider">
            <p><strong>Pedido: ${orderNumber}</strong></p>
            <p>Cliente: ${customerName}</p>
        </div>
        <hr class="ticket-divider">
        <div class="ticket-items">
            <table>
                <thead>
                    <tr>
                        <th class="col-qty">Cant</th>
                        <th class="col-item">Producto</th>
                        <th class="col-price">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td class="col-qty">${item.quantity}</td>
                            <td class="col-item">${item.name}</td>
                            <td class="col-price">S/${item.price.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <hr class="ticket-divider">
        <div class="ticket-total">
            TOTAL: S/${total.toFixed(2)}
        </div>
        <div class="ticket-footer">
            <p>¡Gracias por su pedido!</p>
        </div>
    `;
    
    successSummaryContainer.innerHTML = summaryHtml;
    printableTicketContainer.innerHTML = ticketHtml;

    toggleModal(successModal, true);
}


// --- SUPABASE FUNCTIONS ---
async function fetchMenuData() {
    showLoader(true);
    try {
        if (supabase) {
            const { data: categoriesData, error: categoriesError } = await supabase.from('categorias').select('*');
            if (categoriesError) throw categoriesError;

            const { data: productsData, error: productsError } = await supabase.from('productos').select('*');
            if (productsError) throw productsError;

            menuData = categoriesData.map(category => ({
                id: category.id,
                name: category.nombre,
                icon: category.icono,
                products: productsData
                    .filter(p => p.categoria_id === category.id)
                    .map(p => ({
                        id: p.id,
                        name: p.nombre,
                        description: p.descripcion,
                        price: p.precio,
                        image: p.imagen_url,
                        isMostOrdered: p.es_mas_pedido
                    }))
            }));
        } else {
             console.log("Supabase no está configurado, usando datos locales.");
             menuData = localMenuData;
        }
        
        if (menuData.length > 0) {
            state.selectedCategoryId = menuData[0].id;
        }

    } catch (error) {
        console.error("Error al cargar el menú desde Supabase:", error);
        alert("No se pudo cargar el menú. Se mostrarán datos de ejemplo.");
        menuData = localMenuData; // Fallback to local data
        if (menuData.length > 0) {
            state.selectedCategoryId = menuData[0].id;
        }
    } finally {
        showLoader(false);
    }
}

async function handleCheckoutSubmit(event: Event) {
    event.preventDefault();
    if (!supabase) {
        alert("El sistema de pedidos no está disponible en este momento.");
        return;
    }

    const formData = new FormData(checkoutForm);
    const customerName = formData.get('name') as string;
    const customerPhone = formData.get('phone') as string;

    if (!customerName.trim() || !customerPhone.trim()) {
        alert("Por favor, completa tu nombre y teléfono.");
        return;
    }

    showLoader(true);
    try {
        const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // 1. Insertar en la tabla 'pedidos'
        const { data: orderData, error: orderError } = await supabase
            .from('pedidos')
            .insert({
                nombre_cliente: customerName,
                telefono_cliente: customerPhone,
                total: total
            })
            .select()
            .single();

        if (orderError) throw orderError;
        
        const orderId = orderData.id;
        const orderNumber = orderData.numero_pedido;

        // 2. Preparar los items del pedido
        const orderItems = state.cart.map(item => ({
            pedido_id: orderId,
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }));

        // 3. Insertar en la tabla 'pedido_items'
        const { error: itemsError } = await supabase.from('pedido_items').insert(orderItems);

        if (itemsError) throw itemsError;

        // Éxito
        toggleModal(checkoutModal, false);
        toggleCart(false);
        showSuccessScreen(orderNumber, customerName, state.cart, total);
        state.cart = []; // Limpiar carrito
        renderCart();

    } catch (error) {
        console.error("Error al enviar el pedido:", error);
        alert("Hubo un problema al enviar tu pedido. Por favor, intenta de nuevo.");
    } finally {
        showLoader(false);
    }
}


// --- INITIALIZATION ---
async function init() {
  await fetchMenuData();
  
  categoriesGridContainer.addEventListener('click', handleCategoryGridClick);
  categoriesContainer.addEventListener('click', handleCategoryFilterClick);
  productsGrid.addEventListener('click', handleProductGridClick);
  cartItemsContainer.addEventListener('click', handleCartItemsClick);
  
  navCartBtn.addEventListener('click', () => toggleCart(true));
  closeCartBtn.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));
  
  checkoutBtn.addEventListener('click', () => {
      if (state.cart.length > 0) {
          toggleModal(checkoutModal, true);
      } else {
          alert("Tu carrito está vacío.");
      }
  });
  closeCheckoutModalBtn.addEventListener('click', () => toggleModal(checkoutModal, false));
  checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  
  closeSuccessModalBtn.addEventListener('click', () => {
    toggleModal(successModal, false);
    handleGoHome();
  });
  printTicketBtn.addEventListener('click', () => {
    window.print();
  });


  backToHomeBtn.addEventListener('click', handleGoHome);
  navHomeBtn.addEventListener('click', handleGoHome);

  renderApp();
}

init();

// React entry point - not used for app logic in this file,
// but required by the environment setup.
const App = () => {
  return null; // The app is rendered with vanilla JS
};

const container = document.getElementById('app-root');
if(container){
    const root = createRoot(container);
    root.render(<App />);
}
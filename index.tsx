import React from 'react';
import { createRoot } from 'react-dom/client';

// --- ESTRUCTURA DE DATOS PARA SUPABASE ---
/*
  Aquí tienes el código SQL para crear las tablas en tu proyecto de Supabase.
  Puedes ir a "SQL Editor" en tu dashboard de Supabase y ejecutar este script.

  --- TABLAS ---

  1. categorias: Almacena las categorías del menú.
  2. productos: Contiene cada producto del menú y a qué categoría pertenece.
  3. pedidos: Guarda la información de cada pedido realizado.
  4. pedido_items: Una tabla que relaciona los productos con los pedidos.

  --- DATOS NECESARIOS PARA UN PEDIDO ---
  Al momento de crear un pedido, necesitarás la siguiente información del cliente:
  - Nombre (customer_name)
  - Teléfono (customer_phone)
  - El monto total (total)
  - Una lista de los productos y sus cantidades (se guardarán en `pedido_items`)

*/
/*
-- 1. Tabla de Categorías
CREATE TABLE categorias (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL,
  icono TEXT
);

-- 2. Tabla de Productos
CREATE TABLE productos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL,
  imagen_url TEXT,
  es_mas_pedido BOOLEAN DEFAULT FALSE,
  categoria_id BIGINT REFERENCES categorias(id)
);

-- 3. Tabla de Pedidos
-- 'status' puede ser: 'pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado'
CREATE TABLE pedidos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre_cliente TEXT NOT NULL,
  telefono_cliente TEXT,
  total NUMERIC(10, 2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Items del Pedido (Tabla de unión)
CREATE TABLE pedido_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id BIGINT NOT NULL REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(10, 2) NOT NULL
);

*/


type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isMostOrdered?: boolean;
};

type Category = {
  id: string;
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

// --- DATA (Datos locales de ejemplo) ---
const promosData: Promo[] = [
    { id: 1, title: 'Combo Clásico', description: 'Hamburguesa + Papas + Bebida', image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'},
    { id: 2, title: '2x1 en Milkshakes', description: 'Todos los martes y jueves', image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'},
    { id: 3, title: 'Noche de Alitas', description: 'Porción de alitas + Cerveza', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'},
];

const menuData: Category[] = [
    {
      id: 'hamburguesas',
      name: 'Hamburguesas',
      icon: '🍔',
      products: [
        { id: 1, name: 'Hamburguesa Clásica', description: 'Carne 100% res, queso cheddar, lechuga, tomate, cebolla y mayonesa especial.', price: 15.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', isMostOrdered: true },
        { id: 2, name: 'Hamburguesa Doble Queso', description: 'Dos medallones de carne jugosa con doble queso cheddar y salsa de la casa.', price: 20.00, image: 'https://images.unsplash.com/photo-1603771553223-4cf0483833b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
        { id: 3, name: 'Hamburguesa BBQ', description: 'Carne a la parrilla, tocino, queso, cebolla caramelizada y salsa BBQ.', price: 18.00, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
        { id: 4, name: 'Hamburguesa de Pollo Crispy', description: 'Filete de pollo empanizado, lechuga, tomate y mayonesa con toque de ajo.', price: 16.00, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
      ],
    },
    {
      id: 'acompanamientos',
      name: 'Acompañamientos',
      icon: '🍟',
      products: [
        { id: 5, name: 'Papas Fritas Clásicas', description: 'Papas naturales crocantes, servidas con ketchup o mayonesa.', price: 7.00, image: 'https://images.unsplash.com/photo-1598679253544-2c9740680140?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', isMostOrdered: true },
        { id: 6, name: 'Aros de Cebolla', description: 'Cebollas empanizadas y fritas, servidas con salsa tártara.', price: 8.00, image: 'https://images.unsplash.com/photo-1549849171-0761e702c270?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
        { id: 7, name: 'Nuggets de Pollo', description: 'Trozos de pollo empanizado acompañados de salsas.', price: 9.00, image: 'https://images.unsplash.com/photo-1626082912437-b615a1a1b1d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
      ],
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      icon: '🧃',
      products: [
        { id: 8, name: 'Gaseosas Personales', description: 'Inca Kola, Coca-Cola, Pepsi, disponibles frías.', price: 5.00, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
        { id: 9, name: 'Jugos Naturales', description: 'De frutas peruanas: maracuyá, piña, fresa, mango o limón.', price: 8.00, image: 'https://images.unsplash.com/photo-1506802963788-5235b3174579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
        { id: 10, name: 'Milkshakes', description: 'Vainilla, chocolate, fresa o galleta Oreo.', price: 12.00, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', isMostOrdered: true },
      ],
    },
     {
      id: 'postres',
      name: 'Postres',
      icon: '🍰',
      products: [
        { id: 11, name: 'Brownie con Helado', description: 'Brownie caliente con bola de helado de vainilla.', price: 10.00, image: 'https://images.unsplash.com/photo-1610412351934-eea8b7a1d354?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
        { id: 12, name: 'Cheesecake de Maracuyá', description: 'Porción de postre cremoso con cobertura natural.', price: 12.00, image: 'https://images.unsplash.com/photo-1543598223-14c1d497c31e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
      ],
    },
];

// --- STATE ---
let state: {
  selectedCategory: string;
  cart: CartItem[];
  currentView: 'home' | 'products';
} = {
  selectedCategory: menuData[0].id,
  cart: [],
  currentView: 'home',
};

// --- DOM ELEMENTS ---
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
    <div class="category-chip ${state.selectedCategory === category.id ? 'active' : ''}" data-category-id="${category.id}">
      ${category.name}
    </div>
  `).join('');
}

function renderProducts() {
  productsGrid.innerHTML = '';
  const category = menuData.find(c => c.id === state.selectedCategory);
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
    // Cart is always rendered to keep it updated
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
        state.selectedCategory = card.dataset.categoryId;
        state.currentView = 'products';
        renderApp();
    }
}

function handleCategoryFilterClick(event: Event) {
    const target = event.target as HTMLElement;
    const chip = target.closest('.category-chip');
    if (chip instanceof HTMLElement && chip.dataset.categoryId) {
        state.selectedCategory = chip.dataset.categoryId;
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

// --- INITIALIZATION ---
function init() {
  categoriesGridContainer.addEventListener('click', handleCategoryGridClick);
  categoriesContainer.addEventListener('click', handleCategoryFilterClick);
  productsGrid.addEventListener('click', handleProductGridClick);
  cartItemsContainer.addEventListener('click', handleCartItemsClick);
  
  navCartBtn.addEventListener('click', () => toggleCart(true));
  closeCartBtn.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));

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
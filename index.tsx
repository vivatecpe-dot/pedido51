import React from 'react';
import { createRoot } from 'react-dom/client';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
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

// --- DATA ---
const menuData: Category[] = [
    {
      id: 'hamburguesas',
      name: 'Hamburguesas',
      icon: '🍔',
      products: [
        { id: 1, name: 'Hamburguesa Clásica', description: 'Carne 100% res, queso cheddar, lechuga, tomate, cebolla y mayonesa especial.', price: 15.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
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
        { id: 5, name: 'Papas Fritas Clásicas', description: 'Papas naturales crocantes, servidas con ketchup o mayonesa.', price: 7.00, image: 'https://images.unsplash.com/photo-1598679253544-2c9740680140?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
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
        { id: 10, name: 'Milkshakes', description: 'Vainilla, chocolate, fresa o galleta Oreo.', price: 12.00, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
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
} = {
  selectedCategory: menuData[0].id,
  cart: [],
};

// --- DOM ELEMENTS ---
const categoriesContainer = document.getElementById('categories-container') as HTMLElement;
const productsGrid = document.getElementById('products-grid') as HTMLElement;
const cartBadgeContainer = document.getElementById('cart-badge-container') as HTMLElement;
const cartItemsContainer = document.getElementById('cart-items-container') as HTMLElement;
const cartTotalPriceEl = document.getElementById('cart-total-price') as HTMLElement;
const cartPanel = document.getElementById('cart-panel') as HTMLElement;
const cartOverlay = document.getElementById('cart-overlay') as HTMLElement;
const closeCartBtn = document.getElementById('close-cart-btn') as HTMLElement;
const navCartBtn = document.getElementById('nav-cart') as HTMLElement;

// --- RENDER FUNCTIONS ---
function renderCategories() {
  categoriesContainer.innerHTML = '';
  menuData.forEach(category => {
    const chip = document.createElement('div');
    chip.className = `category-chip ${state.selectedCategory === category.id ? 'active' : ''}`;
    chip.textContent = `${category.icon} ${category.name}`;
    chip.dataset.categoryId = category.id;
    categoriesContainer.appendChild(chip);
  });
}

function renderProducts() {
  productsGrid.innerHTML = '';
  const category = menuData.find(c => c.id === state.selectedCategory);
  if (!category) return;

  category.products.forEach(product => {
    productsGrid.innerHTML += `
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
    `;
  });
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


function handleCategoryClick(event: Event) {
    const target = event.target as HTMLElement;
    const chip = target.closest('.category-chip');
    if (chip instanceof HTMLElement && chip.dataset.categoryId) {
        state.selectedCategory = chip.dataset.categoryId;
        render();
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

function toggleCart(visible: boolean) {
    cartPanel.classList.toggle('visible', visible);
    cartOverlay.classList.toggle('visible', visible);
}

// --- INITIALIZATION ---
function render() {
  renderCategories();
  renderProducts();
  renderCart();
}

function init() {
  categoriesContainer.addEventListener('click', handleCategoryClick);
  productsGrid.addEventListener('click', handleProductGridClick);
  cartItemsContainer.addEventListener('click', handleCartItemsClick);
  navCartBtn.addEventListener('click', () => toggleCart(true));
  closeCartBtn.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));
  render();
}

init();

// React entry point - not used for app logic in this file,
// but required by the environment setup.
const App = () => {
  return <h1>Pedidos51 Loaded</h1>;
};

const container = document.getElementById('app-root');
if(container){
    const root = createRoot(container);
    // The main app logic is imperative vanilla JS, so we render a placeholder.
}

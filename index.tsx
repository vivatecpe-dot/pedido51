
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

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

type Profile = {
    role: 'admin' | 'vendedor' | 'delivery' | null;
    full_name: string | null;
};

// --- STATE ---
let state: {
  selectedCategoryId: number;
  cart: CartItem[];
  currentView: 'home' | 'products';
  user: User | null;
  profile: Profile | null;
} = {
  selectedCategoryId: 0,
  cart: [],
  currentView: 'home',
  user: null,
  profile: null,
};
let menuData: Category[] = [];

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
let navUserBtn = document.getElementById('nav-user') as HTMLElement;
const userDisplay = document.getElementById('user-display') as HTMLElement;
const checkoutBtn = document.getElementById('checkout-btn') as HTMLElement;
// Modals
const checkoutModal = document.getElementById('checkout-modal') as HTMLElement;
const closeCheckoutModalBtn = document.getElementById('close-checkout-modal-btn') as HTMLElement;
const successModal = document.getElementById('success-modal') as HTMLElement;
const closeSuccessModalBtn = document.getElementById('close-success-modal-btn') as HTMLElement;
const authModal = document.getElementById('auth-modal') as HTMLElement;
const closeAuthModalBtn = document.getElementById('close-auth-modal-btn') as HTMLElement;
// Forms
const checkoutForm = document.getElementById('checkout-form') as HTMLFormElement;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const signupForm = document.getElementById('signup-form') as HTMLFormElement;
// Auth UI
const loginTabBtn = document.getElementById('login-tab-btn') as HTMLButtonElement;
const signupTabBtn = document.getElementById('signup-tab-btn') as HTMLButtonElement;
const loginErrorEl = document.getElementById('login-error') as HTMLParagraphElement;
const signupErrorEl = document.getElementById('signup-error') as HTMLParagraphElement;
// Ticket
const printTicketBtn = document.getElementById('print-ticket-btn') as HTMLElement;


// --- RENDER FUNCTIONS ---
function renderPromos() {
    // Dummy data for now
    const promosData = [
        { id: 1, title: 'Combo Clásico', description: 'Hamburguesa + Papas + Bebida', image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'},
    ];
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
    updateUserUI();
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
function showSuccessScreen(orderNumber: string, customerName: string, customerAddress: string, cart: CartItem[], total: number) {
    const successSummaryContainer = document.getElementById('success-order-summary') as HTMLElement;
    const printableTicketContainer = document.getElementById('printable-ticket') as HTMLElement;

    const summaryHtml = `
        <h4>Pedido: ${orderNumber}</h4>
        <p><strong>Cliente:</strong> ${customerName}</p>
        <p><strong>Dirección:</strong> ${customerAddress}</p>
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
            <p>Dirección: ${customerAddress}</p>
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


// --- SUPABASE DATA FUNCTIONS ---
async function fetchMenuData() {
    showLoader(true);
    try {
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
        
        if (menuData.length > 0) {
            state.selectedCategoryId = menuData[0].id;
        }

    } catch (error) {
        console.error("Error al cargar el menú desde Supabase:", error);
        alert("No se pudo cargar el menú. Revisa la consola para más detalles.");
    } finally {
        showLoader(false);
    }
}

async function handleCheckoutSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const customerName = formData.get('name') as string;
    const customerPhone = formData.get('phone') as string;
    const customerAddress = formData.get('address') as string;

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    showLoader(true);
    try {
        const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const { data: orderData, error: orderError } = await supabase
            .from('pedidos')
            .insert({
                nombre_cliente: customerName,
                telefono_cliente: customerPhone,
                direccion: customerAddress,
                total: total
            })
            .select()
            .single();

        if (orderError) throw orderError;
        
        const orderId = orderData.id;
        const orderNumber = orderData.numero_pedido;

        const orderItems = state.cart.map(item => ({
            pedido_id: orderId,
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }));

        const { error: itemsError } = await supabase.from('pedido_items').insert(orderItems);
        if (itemsError) throw itemsError;

        toggleModal(checkoutModal, false);
        toggleCart(false);
        showSuccessScreen(orderNumber, customerName, customerAddress, state.cart, total);
        state.cart = [];
        renderCart();
        checkoutForm.reset();

    } catch (error) {
        console.error("Error al enviar el pedido:", error);
        alert("Hubo un problema al enviar tu pedido. Por favor, intenta de nuevo.");
    } finally {
        showLoader(false);
    }
}

// --- SUPABASE AUTH FUNCTIONS ---
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
        alert('Error al cerrar sesión.');
    }
    // onAuthStateChange will handle UI update.
}

async function fetchUserProfile(user: User): Promise<Profile | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

function updateUserUI() {
    const oldNavUserBtn = document.getElementById('nav-user');
    let newNavUserBtn: HTMLElement;

    if (!state.user) {
        // --- User is NOT logged in ---
        userDisplay.textContent = '';
        const button = document.createElement('div');
        button.id = 'nav-user';
        button.className = 'nav-item';
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" title="Acceso"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;
        button.addEventListener('click', () => toggleModal(authModal, true));
        newNavUserBtn = button;
    } else {
        // --- User IS logged in ---
        // Display name, fallback to email if profile/name is missing
        userDisplay.textContent = state.profile?.full_name || state.user.email || '';
        
        const isStaff = state.profile && ['admin', 'vendedor', 'delivery'].includes(state.profile.role as string);

        if (isStaff) {
            // --- Staff user with a loaded profile ---
            const link = document.createElement('a');
            link.href = '/admin.html';
            link.id = 'nav-user';
            link.className = 'nav-item';
            link.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" title="Panel de Administración"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.5c-13.6-11.3-33.1-9.5-44.5 4.1s-9.5 33.1 4.1 44.5l103.4 86.2c13.6 11.3 33.1 9.5 44.5-4.1s9.5-33.1-4.1-44.5L143.5 120.5zM512 256a256 256 0 1 0-512 0A256 256 0 1 0 512 256zM256 480a224 224 0 1 1 0-448 224 224 0 1 1 0 448z"/></svg>`;
            newNavUserBtn = link;
        } else {
            // --- Regular user, OR any user whose profile failed to load ---
            // This is the safe fallback: the user is authenticated, so we show a logout button.
             const button = document.createElement('div');
             button.id = 'nav-user';
             button.className = 'nav-item';
             button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" title="Cerrar Sesión"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>`;
             button.addEventListener('click', handleLogout);
             newNavUserBtn = button;
        }
    }
    
    if (oldNavUserBtn) {
        oldNavUserBtn.replaceWith(newNavUserBtn);
    }
    navUserBtn = newNavUserBtn;
}

async function handleLoginSubmit(event: Event) {
    event.preventDefault();
    loginErrorEl.textContent = '';
    const formData = new FormData(loginForm);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
        console.error('Login Error:', signInError);
        loginErrorEl.textContent = signInError.message;
        return;
    }

    if (signInData.user) {
        try {
            // After successful auth, immediately check if the profile is readable.
            // This catches RLS issues before the user leaves the login modal.
            const { error: profileError } = await supabase
                .from('profiles')
                .select('role') // Selecting a small column is fine.
                .eq('id', signInData.user.id)
                .single();

            if (profileError) {
                // This is the "Database error querying schema" scenario.
                console.error('Database error querying profile after login:', profileError);
                loginErrorEl.textContent = 'Error al leer el perfil. Verifique los permisos de la base de datos (RLS).';
                // Sign the user out to prevent a broken, half-logged-in state.
                await supabase.auth.signOut();
                return; // Stay in the modal to show the error.
            }
        } catch (e) {
             console.error('Unexpected error during profile check:', e);
             loginErrorEl.textContent = 'Ocurrió un error inesperado al verificar el perfil.';
             await supabase.auth.signOut();
             return;
        }
    }

    // If we reach here, both auth and profile check passed.
    toggleModal(authModal, false);
    loginForm.reset();
}


async function handleSignupSubmit(event: Event) {
    event.preventDefault();
    signupErrorEl.textContent = '';
    const formData = new FormData(signupForm);
    const fullName = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    });

    if (error) {
        signupErrorEl.textContent = 'No se pudo crear la cuenta. Inténtalo de nuevo.';
    } else {
        alert('¡Cuenta creada! Ya puedes iniciar sesión.');
        // Switch to login tab automatically
        loginTabBtn.click();
        signupForm.reset();
    }
}


// --- INITIALIZATION ---
async function init() {
  await fetchMenuData();
  
  // Event Listeners
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
  printTicketBtn.addEventListener('click', () => window.print());

  backToHomeBtn.addEventListener('click', handleGoHome);
  navHomeBtn.addEventListener('click', handleGoHome);
  // Initial navUserBtn listener is set in updateUserUI

  // Auth Modal Listeners
  closeAuthModalBtn.addEventListener('click', () => toggleModal(authModal, false));
  loginTabBtn.addEventListener('click', () => {
      loginTabBtn.classList.add('active');
      signupTabBtn.classList.remove('active');
      loginForm.classList.add('active');
      signupForm.classList.remove('active');
  });
  signupTabBtn.addEventListener('click', () => {
      signupTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      signupForm.classList.add('active');
      loginForm.classList.remove('active');
  });
  loginForm.addEventListener('submit', handleLoginSubmit);
  signupForm.addEventListener('submit', handleSignupSubmit);

  // Auth State Listener
  supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
    state.user = session?.user ?? null;
    if (state.user) {
        state.profile = await fetchUserProfile(state.user);
    } else {
        state.profile = null;
    }
    updateUserUI();
  });

  // Initial call to set up the UI based on initial auth state
  const { data: { session } } = await supabase.auth.getSession();
  state.user = session?.user ?? null;
  if (state.user) {
      state.profile = await fetchUserProfile(state.user);
  } else {
      state.profile = null;
  }
  
  renderApp();
}

init();

// React entry point
const App = () => null; // The app is rendered with vanilla JS

const container = document.getElementById('app-root');
if(container){
    const root = createRoot(container);
    root.render(<App />);
}

const menuData = [
    {
        name: "Hamburguesas",
        icon: "🍔",
        products: [
            { name: "Hamburguesa Clásica", description: "Pan artesanal, carne 100% res, queso cheddar, lechuga, tomate, cebolla y mayonesa especial.", price: 15.90 },
            { name: "Hamburguesa Doble Queso", description: "Dos medallones de carne jugosa con doble queso cheddar y salsa de la casa.", price: 20.90 },
            { name: "Hamburguesa BBQ", description: "Carne de res a la parrilla con tocino crocante, queso, cebolla caramelizada y salsa BBQ.", price: 19.90 },
            { name: "Hamburguesa de Pollo Crispy", description: "Filete de pollo empanizado, lechuga, tomate y mayonesa con toque de ajo.", price: 17.90 },
            { name: "Hamburguesa Mixta", description: "Mitad carne de res, mitad pollo, con queso y salsa ahumada.", price: 18.90 },
            { name: "Hamburguesa Veggie", description: "Medallón de garbanzos o lentejas, pan integral, lechuga, tomate y salsa de yogurt.", price: 16.90 },
            { name: "Hamburguesa Gourmet (La Especial)", description: "Carne angus, palta, huevo frito, champiñones y salsa artesanal.", price: 22.90 },
            { name: "Mini Burgers (Sliders)", description: "Tres mini hamburguesas variadas para compartir o probar distintos sabores.", price: 25.90 },
        ]
    },
    {
        name: "Acompañamientos",
        icon: "🍟",
        products: [
            { name: "Papas Fritas Clásicas", description: "Papas naturales crocantes, servidas con ketchup o mayonesa.", price: 7.90 },
            { name: "Papas al Hilo o Camote Frito", description: "Alternativa peruana con toque dulce y salado.", price: 8.90 },
            { name: "Aros de Cebolla", description: "Cebollas empanizadas y fritas hasta dorar, servidas con salsa tártara.", price: 9.90 },
            { name: "Nuggets de Pollo", description: "Trozos de pollo empanizado acompañados de salsas BBQ y tártara.", price: 12.90 },
            { name: "Alitas BBQ o Picantes", description: "Alitas de pollo bañadas en salsa BBQ, búfalo o ají ahumado.", price: 15.90 },
            { name: "Yuca Frita / Tequeños", description: "Crocantes y acompañados de guacamole o ají criollo.", price: 10.90 },
            { name: "Ensalada Fresca / Coleslaw", description: "Mezcla de col, zanahoria y aderezo especial para acompañar tu burger.", price: 6.90 },
        ]
    },
    {
        name: "Bebidas",
        icon: "🧃",
        products: [
            { name: "Gaseosas Personales", description: "Inca Kola, Coca-Cola, Pepsi, disponibles frías.", price: 4.00 },
            { name: "Jugos Naturales", description: "De frutas peruanas: maracuyá, piña, fresa, mango o limón.", price: 7.00 },
            { name: "Chicha Morada / Emoliente Frío", description: "Refrescos tradicionales con toque casero.", price: 5.00 },
            { name: "Cerveza Artesanal o Nacional", description: "Cusqueña, Pilsen o marcas locales.", price: 9.00 },
            { name: "Malteadas / Milkshakes", description: "Vainilla, chocolate, fresa o galleta Oreo.", price: 12.00 },
            { name: "Agua Mineral / con Gas", description: "Opcional saludable.", price: 3.00 },
        ]
    },
    {
        name: "Postres",
        icon: "🍰",
        products: [
            { name: "Brownie con Helado", description: "Brownie caliente con bola de helado de vainilla.", price: 12.90 },
            { name: "Cheesecake de Maracuyá / Fresa", description: "Porción de postre cremoso con cobertura natural.", price: 10.90 },
            { name: "Pie de Limón / Manzana", description: "Postre clásico casero.", price: 9.90 },
            { name: "Galleta Gigante o Cookie Choco Chips", description: "Dulce individual para acompañar café o milkshake.", price: 6.90 },
            { name: "Helado Artesanal", description: "En vaso o cono, varios sabores.", price: 8.90 },
        ]
    },
    {
        name: "Combos",
        icon: "🥡",
        products: [
            { name: "Combo Clásico", description: "Hamburguesa clásica + papas + gaseosa.", price: 25.90 },
            { name: "Combo Doble", description: "Hamburguesa doble + papas grandes + bebida.", price: 32.90 },
            { name: "Combo Familiar", description: "2 hamburguesas + 2 papas + 2 bebidas.", price: 49.90 },
            { name: "Combo Kids", description: "Mini burger + papas pequeñas + jugo natural.", price: 19.90 },
            { name: "Combo Nocturno / Midnight", description: "Hamburguesa + bebida + alitas BBQ.", price: 34.90 },
        ]
    },
    {
        name: "Extras y Adiciones",
        icon: "🌶️",
        products: [
            { name: "Queso Extra", description: "Agrega más queso a tu hamburguesa.", price: 3.00 },
            { name: "Tocino / Huevo / Palta", description: "Ingredientes premium para personalizar tu burger.", price: 4.00 },
            { name: "Salsas Caseras", description: "BBQ, ajo, tártara, rocoto o ají amarillo.", price: 1.50 },
            { name: "Papas Grandes / Upgrade de bebida", description: "Mejora tu combo con un toque adicional.", price: 5.00 },
        ]
    },
];

const rootElement = document.getElementById('root');
let state = {
    activeCategoryIndex: 0,
    cart: [],
    isCartOpen: false,
};

function setState(newState) {
    state = { ...state, ...newState };
    render();
}

function getProductByName(name) {
    for (const category of menuData) {
        const product = category.products.find(p => p.name === name);
        if (product) return product;
    }
    return null;
}

function handleCategoryClick(index) {
    setState({ activeCategoryIndex: index });
}

function handleAddToCart(productName) {
    const product = getProductByName(productName);
    if (!product) return;

    const existingItem = state.cart.find(item => item.name === productName);
    let newCart;

    if (existingItem) {
        newCart = state.cart.map(item =>
            item.name === productName ? { ...item, quantity: item.quantity + 1 } : item
        );
    } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
    }
    setState({ cart: newCart });
}

function handleUpdateQuantity(productName, change) {
    let newCart = state.cart.map(item =>
        item.name === productName ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    ).filter(item => item.quantity > 0);
    setState({ cart: newCart });
}

function handleToggleCart() {
    setState({ isCartOpen: !state.isCartOpen });
}

function renderMenu() {
    const activeCategory = menuData[state.activeCategoryIndex];

    const categoriesHTML = menuData.map((category, index) => `
        <div 
            class="category-item ${index === state.activeCategoryIndex ? 'active' : ''}" 
            data-index="${index}"
            role="button"
            tabindex="0"
        >
            <span>${category.icon}</span>
            ${category.name}
        </div>
    `).join('');

    const productsHTML = activeCategory.products.map(product => `
        <div class="product-card">
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
            <div class="product-card-footer">
                <span class="product-price">S/ ${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" data-product-name="${product.name}" aria-label="Añadir ${product.name} al carrito">+</button>
            </div>
        </div>
    `).join('');

    return `
        <header>
            <h1>Nuestro Menú</h1>
        </header>
        <nav class="categories-list" aria-label="Categorías de menú">
            ${categoriesHTML}
        </nav>
        <main class="products-section">
            <h2>${activeCategory.icon} ${activeCategory.name}</h2>
            <div class="products-grid">
                ${productsHTML}
            </div>
        </main>
    `;
}

function renderCart() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartItemsHTML = state.cart.length > 0 ? state.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>S/ ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" data-change="-1" data-product-name="${item.name}">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn" data-change="1" data-product-name="${item.name}">+</button>
                <button class="remove-item-btn" data-change="-1000" data-product-name="${item.name}">🗑️</button>
            </div>
        </div>
    `).join('') : '<p class="empty-cart">Tu carrito está vacío.</p>';

    const cartPanelHTML = `
        <aside class="cart-panel ${state.isCartOpen || window.innerWidth >= 1024 ? 'open' : ''}">
            <div class="cart-header">
                <h2>Mi Pedido</h2>
                <button class="close-cart-btn" aria-label="Cerrar carrito">&times;</button>
            </div>
            <div class="cart-items">${cartItemsHTML}</div>
            ${state.cart.length > 0 ? `
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>S/ ${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>S/ ${subtotal.toFixed(2)}</span>
                </div>
                <button class="checkout-btn">Realizar Pedido</button>
            </div>
            ` : ''}
        </aside>
    `;

    const cartFabHTML = `
        <button class="cart-fab" aria-label="Abrir carrito">
            🛒
            ${totalItems > 0 ? `<span class="cart-count">${totalItems}</span>` : ''}
        </button>
    `;
    
    return cartPanelHTML + cartFabHTML;
}


function render() {
    if (!rootElement) return;

    rootElement.innerHTML = `
        <div class="main-container">
            <div class="menu-content">
                ${renderMenu()}
            </div>
            ${renderCart()}
        </div>
    `;
    
    // Manage body scroll when cart is open on mobile
    if (state.isCartOpen && window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Fix for lines 249, 256, 263, 271: The 'closest' method does not exist on 'EventTarget'.
// This is resolved by casting `event.target` to `Element`.
// Additionally, `instanceof HTMLElement` is used as a type guard to safely access the `dataset` property on the found elements.
function attachEventListeners() {
    rootElement.addEventListener('click', (event) => {
        const target = event.target as Element;
        
        // Category click
        const categoryItem = target.closest('.category-item');
        if (categoryItem instanceof HTMLElement) {
            handleCategoryClick(parseInt(categoryItem.dataset.index, 10));
            return;
        }

        // Add to cart
        const addToCartBtn = target.closest('.add-to-cart-btn');
        if (addToCartBtn instanceof HTMLElement) {
            handleAddToCart(addToCartBtn.dataset.productName);
            return;
        }

        // Update quantity
        const quantityBtn = target.closest('.quantity-btn, .remove-item-btn');
        if (quantityBtn instanceof HTMLElement) {
            const change = parseInt(quantityBtn.dataset.change, 10);
            handleUpdateQuantity(quantityBtn.dataset.productName, change);
            return;
        }

        // Toggle cart
        const cartToggle = target.closest('.cart-fab, .close-cart-btn');
        if (cartToggle) {
            handleToggleCart();
            return;
        }
    });
}

if (rootElement) {
    attachEventListeners();
    render();
    window.addEventListener('resize', render); // Re-render on resize for responsiveness
}

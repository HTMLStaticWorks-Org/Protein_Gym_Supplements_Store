/**
 * IRONVAULT Store & Global Utilities
 * Manages Cart (localStorage), Theme (Dark/Light), Direction (RTL/LTR),
 * Search Modal, Quick View Modal, and Toast Notifications.
 */

const IRONVAULT_STORE = {
  cart: [],
  theme: 'dark',
  direction: 'ltr',

  init() {
    this.loadPreferences();
    this.loadCart();
    this.bindGlobalEvents();
    this.renderCartUI();
  },

  // --- THEME & DIRECTION SYSTEM ---
  loadPreferences() {
    const savedTheme = localStorage.getItem('ironvault_theme') || 'dark';
    const savedDir = localStorage.getItem('ironvault_dir') || 'ltr';
    this.setTheme(savedTheme, false);
    this.setDirection(savedDir, false);
  },

  setTheme(theme, save = true) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (save) localStorage.setItem('ironvault_theme', theme);

    // Update icons on square toggle buttons
    document.querySelectorAll('.theme-toggle-icon').forEach(el => {
      el.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    });
    if (window.lucide) lucide.createIcons();
  },

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme, true);
    this.showToast(`Switched to ${nextTheme.toUpperCase()} theme`, nextTheme === 'dark' ? 'moon' : 'sun');
  },

  setDirection(dir, save = true) {
    this.direction = dir;
    document.documentElement.setAttribute('dir', dir);
    if (save) localStorage.setItem('ironvault_dir', dir);
  },

  toggleDirection() {
    const nextDir = this.direction === 'ltr' ? 'rtl' : 'ltr';
    this.setDirection(nextDir, true);
    this.showToast(`Switched layout to ${nextDir.toUpperCase()}`, 'globe');
  },

  // --- CART SYSTEM (LOCALSTORAGE) ---
  loadCart() {
    try {
      const saved = localStorage.getItem('ironvault_cart');
      this.cart = saved ? JSON.parse(saved) : [];
    } catch (e) {
      this.cart = [];
    }
  },

  saveCart() {
    localStorage.setItem('ironvault_cart', JSON.stringify(this.cart));
    this.renderCartUI();
  },

  addToCart(productId, flavour = null, size = null, qty = 1) {
    const product = IRONVAULT_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const chosenFlavour = flavour || product.flavours[0];
    const chosenSize = size || product.sizes[0];
    const cartItemId = `${product.id}__${chosenFlavour}__${chosenSize}`.replace(/\s+/g, '_');

    const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);
    if (existingIndex > -1) {
      this.cart[existingIndex].qty += qty;
    } else {
      this.cart.push({
        cartItemId,
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        flavour: chosenFlavour,
        size: chosenSize,
        qty: qty
      });
    }

    this.saveCart();
    this.showToast(`Added ${product.name} to cart`, 'shopping-bag');
    this.toggleCartDrawer(true);
  },

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
    this.saveCart();
    this.showToast('Item removed from cart', 'trash-2');
  },

  updateQty(cartItemId, delta) {
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.removeFromCart(cartItemId);
    } else {
      this.saveCart();
    }
  },

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.qty, 0);
  },

  getCartSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.qty), 0);
  },

  renderCartUI() {
    const count = this.getCartCount();
    const subtotal = this.getCartSubtotal();

    // Update Badges
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-block' : 'none';
    });

    // Update Subtotal Elements
    document.querySelectorAll('.cart-subtotal-amount').forEach(el => {
      el.textContent = `$${subtotal.toFixed(2)}`;
    });

    // Render Drawer Content
    const cartItemsContainer = document.getElementById('cartDrawerItems');
    const emptyState = document.getElementById('cartEmptyState');
    const footer = document.getElementById('cartDrawerFooter');

    if (!cartItemsContainer) return;

    if (this.cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (footer) footer.style.display = 'none';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (footer) footer.style.display = 'flex';

      cartItemsContainer.innerHTML = this.cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-meta">
              <span>${item.flavour} &bull; ${item.size}</span>
            </div>
            <div class="cart-item-qty-row">
              <div class="qty-control">
                <button class="qty-btn" onclick="IRONVAULT_STORE.updateQty('${item.cartItemId}', -1)">-</button>
                <span class="qty-input">${item.qty}</span>
                <button class="qty-btn" onclick="IRONVAULT_STORE.updateQty('${item.cartItemId}', 1)">+</button>
              </div>
              <div class="d-flex align-items-center gap-3">
                <span class="fw-bold text-electric">$${(item.price * item.qty).toFixed(2)}</span>
                <button class="cart-item-remove-btn" onclick="IRONVAULT_STORE.removeFromCart('${item.cartItemId}')" title="Remove item">
                  <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) lucide.createIcons();
  },

  toggleCartDrawer(open) {
    const drawer = document.getElementById('ironCartDrawer');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (!drawer) return;

    if (open) {
      drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // --- SEARCH MODAL SYSTEM ---
  toggleSearchModal(open) {
    const modal = document.getElementById('ironSearchModal');
    const input = document.getElementById('searchModalInput');
    if (!modal) return;

    if (open) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 150);
        this.renderSearchResults('');
      }
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  handleLiveSearch(query) {
    this.renderSearchResults(query.trim().toLowerCase());
  },

  renderSearchResults(query) {
    const container = document.getElementById('searchResultsList');
    if (!container) return;

    if (!query) {
      container.innerHTML = `
        <div class="text-center py-4 text-muted-custom">
          <p class="mb-0">Type supplement name, brand, or goal to search...</p>
        </div>
      `;
      return;
    }

    const matches = IRONVAULT_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.goal.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-muted-custom">
          <p class="mb-0">No matching products found for "<strong>${query}</strong>"</p>
        </div>
      `;
      return;
    }

    container.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="IRONVAULT_STORE.openQuickView('${p.id}'); IRONVAULT_STORE.toggleSearchModal(false);">
        <img src="${p.image}" alt="${p.name}" class="search-result-thumb" />
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center">
            <span class="product-card-brand mb-0">${p.brand}</span>
            <span class="text-electric fw-bold">$${p.price.toFixed(2)}</span>
          </div>
          <h5 class="mb-0" style="font-size: 1.05rem;">${p.name}</h5>
          <small class="text-muted-custom">${p.category} &bull; ${p.goal}</small>
        </div>
      </div>
    `).join('');
  },

  // --- PRODUCT QUICK VIEW MODAL ---
  openQuickView(productId) {
    const product = IRONVAULT_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    let selectedFlavour = product.flavours[0];
    let selectedSize = product.sizes[0];
    let qty = 1;

    const modalContent = document.getElementById('quickViewModalContent');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-header modal-header-iron">
        <div>
          <span class="product-card-brand">${product.brand}</span>
          <h3 class="modal-title mb-0">${product.name}</h3>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body modal-body-iron">
        <div class="row g-4">
          <div class="col-md-6 text-center">
            <img src="${product.image}" alt="${product.name}" class="modal-product-img mb-3" />
            <div class="d-flex justify-content-center gap-2">
              <span class="badge-custom ${product.badgeClass}">${product.badge}</span>
              <span class="badge-custom badge-pro"><i data-lucide="check" style="width: 14px;"></i> In Stock Demo</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex align-items-baseline gap-3 mb-3">
              <span class="display-font text-electric" style="font-size: 2.2rem; font-weight: 900;">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `<span class="product-card-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
              <span class="text-muted-custom small ms-auto">&starf; ${product.rating} (${product.reviewsCount} reviews)</span>
            </div>

            <p class="small text-muted-custom mb-3">${product.description}</p>

            <!-- Flavour Picker -->
            <div class="mb-3">
              <label class="form-label-iron small">Available Flavours:</label>
              <div class="option-pill-group" id="quickViewFlavours">
                ${product.flavours.map((f, idx) => `
                  <button type="button" class="option-pill ${idx === 0 ? 'active' : ''}" onclick="IRONVAULT_STORE.setQuickViewOption(this, 'flavour')">${f}</button>
                `).join('')}
              </div>
            </div>

            <!-- Pack Size Picker -->
            <div class="mb-3">
              <label class="form-label-iron small">Pack Size:</label>
              <div class="option-pill-group" id="quickViewSizes">
                ${product.sizes.map((s, idx) => `
                  <button type="button" class="option-pill ${idx === 0 ? 'active' : ''}" onclick="IRONVAULT_STORE.setQuickViewOption(this, 'size')">${s}</button>
                `).join('')}
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="d-flex align-items-center gap-3 my-4">
              <div class="qty-control" style="height: 44px;">
                <button class="qty-btn" style="width: 36px; height: 100%; font-size: 1.2rem;" onclick="IRONVAULT_STORE.stepModalQty(-1)">-</button>
                <input type="text" id="quickViewQtyInput" class="qty-input" style="width: 44px; font-size: 1.1rem;" value="1" readonly />
                <button class="qty-btn" style="width: 36px; height: 100%; font-size: 1.2rem;" onclick="IRONVAULT_STORE.stepModalQty(1)">+</button>
              </div>
              <button class="btn-iron btn-electric flex-grow-1" onclick="IRONVAULT_STORE.executeQuickViewAdd('${product.id}')">
                <i data-lucide="shopping-bag" style="width: 18px; height: 18px;"></i>
                Add to Cart
              </button>
            </div>

            <!-- Nutrition Facts Table -->
            <div class="p-3 bg-secondary-custom rounded">
              <span class="form-label-iron small mb-2 d-block">Verified Label Nutrition Specs:</span>
              <table class="nutrition-table">
                <tbody>
                  <tr><th>Serving Size</th><td>${product.nutrition.servingSize}</td></tr>
                  <tr><th>Protein / Scoop</th><td>${product.nutrition.protein}</td></tr>
                  <tr><th>BCAAs Content</th><td>${product.nutrition.bcaa}</td></tr>
                  <tr><th>Calories</th><td>${product.nutrition.calories}</td></tr>
                  <tr><th>Carbohydrates / Sugar</th><td>${product.nutrition.carbs} / ${product.nutrition.sugar}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();

    // Trigger Bootstrap Modal
    const bsModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    bsModal.show();
  },

  setQuickViewOption(btn, type) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.option-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  stepModalQty(delta) {
    const input = document.getElementById('quickViewQtyInput');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    input.value = val;
  },

  executeQuickViewAdd(productId) {
    const flavourBtn = document.querySelector('#quickViewFlavours .option-pill.active');
    const sizeBtn = document.querySelector('#quickViewSizes .option-pill.active');
    const qtyInput = document.getElementById('quickViewQtyInput');

    const flavour = flavourBtn ? flavourBtn.textContent.trim() : null;
    const size = sizeBtn ? sizeBtn.textContent.trim() : null;
    const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

    this.addToCart(productId, flavour, size, qty);

    const bsModal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
    if (bsModal) bsModal.hide();
  },

  // --- DEMO CHECKOUT SIMULATION ---
  openCheckoutDemo() {
    if (this.cart.length === 0) {
      this.showToast('Your cart is empty', 'alert-circle');
      return;
    }

    this.toggleCartDrawer(false);

    const checkoutModalEl = document.getElementById('checkoutDemoModal');
    if (!checkoutModalEl) return;

    const subtotal = this.getCartSubtotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const summaryContainer = document.getElementById('checkoutSummaryContent');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="mb-3 p-3 bg-secondary-custom rounded">
          <div class="d-flex justify-content-between mb-2">
            <span>Items (${this.getCartCount()}):</span>
            <span class="fw-bold">$${subtotal.toFixed(2)}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Shipping:</span>
            <span class="fw-bold">${shipping === 0 ? '<span class="text-electric">FREE (Over $50)</span>' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div class="d-flex justify-content-between border-top pt-2">
            <span class="display-font h5 mb-0">Total:</span>
            <span class="display-font h5 mb-0 text-electric">$${total.toFixed(2)}</span>
          </div>
        </div>
      `;
    }

    const bsModal = new bootstrap.Modal(checkoutModalEl);
    bsModal.show();
  },

  submitDemoOrder(event) {
    event.preventDefault();
    const btn = document.getElementById('checkoutSubmitBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing Demo Order...';
    }

    setTimeout(() => {
      // Clear Cart
      this.cart = [];
      this.saveCart();

      const modalBody = document.getElementById('checkoutModalBody');
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="text-center py-5">
            <div class="text-electric mb-3">
              <i data-lucide="check-circle-2" style="width: 72px; height: 72px;"></i>
            </div>
            <h2 class="display-font mb-2">DEMO ORDER CONFIRMED!</h2>
            <p class="text-muted-custom mb-4">
              Thank you for exploring IRONVAULT! This is a frontend demo simulation. No actual payment was charged and no live delivery will be dispatched.
            </p>
            <div class="p-3 bg-secondary-custom rounded mb-4 text-start">
              <p class="small mb-1"><strong>Demo Order Reference:</strong> #IV-2026-${Math.floor(100000 + Math.random() * 900000)}</p>
              <p class="small mb-0 text-muted-custom">Preferences and demo cart records are stored in browser localStorage.</p>
            </div>
            <button type="button" class="btn-iron btn-electric" data-bs-dismiss="modal">
              Return to Store
            </button>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
    }, 1200);
  },

  openWholesaleInquiryModal() {
    window.location.href = 'contact.html?type=Bulk%20Order';
  },

  // --- TOAST NOTIFICATION ---
  showToast(message, iconName = 'bell') {
    let container = document.querySelector('.iron-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'iron-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'iron-toast';
    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px; color: var(--color-electric);"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // --- GLOBAL EVENT LISTENERS ---
  bindGlobalEvents() {
    // Search modal escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleSearchModal(false);
        this.toggleCartDrawer(false);
      }
    });
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  IRONVAULT_STORE.init();
});


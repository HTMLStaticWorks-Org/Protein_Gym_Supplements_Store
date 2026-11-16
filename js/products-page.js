/**
 * IRONVAULT Products Page - Dynamic Filter & Sorting Engine
 */

const IRONVAULT_CATALOG = {
  activeFilters: {
    search: '',
    goals: [],
    categories: [],
    brands: [],
    maxPrice: 100,
    sort: 'featured'
  },

  init() {
    this.parseUrlParams();
    this.renderFilterCheckboxes();
    this.bindEvents();
    this.applyFilters();
  },

  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const goalParam = params.get('goal');
    const catParam = params.get('category');
    const brandParam = params.get('brand');
    const searchParam = params.get('search');

    if (goalParam) this.activeFilters.goals.push(goalParam);
    if (catParam) this.activeFilters.categories.push(catParam);
    if (brandParam) this.activeFilters.brands.push(brandParam);
    if (searchParam) this.activeFilters.search = searchParam;
  },

  renderFilterCheckboxes() {
    // 1. Goal Checkboxes
    const goalContainer = document.getElementById('filterGoalsContainer');
    if (goalContainer) {
      goalContainer.innerHTML = IRONVAULT_GOALS.map(g => {
        const isChecked = this.activeFilters.goals.includes(g.name);
        return `
          <label class="filter-checkbox-label">
            <span>
              <input type="checkbox" value="${g.name}" class="filter-goal-check" ${isChecked ? 'checked' : ''} />
              ${g.name}
            </span>
            <span class="small text-muted-custom">(${g.count})</span>
          </label>
        `;
      }).join('');
    }

    // 2. Category Checkboxes
    const catContainer = document.getElementById('filterCategoriesContainer');
    if (catContainer) {
      catContainer.innerHTML = IRONVAULT_CATEGORIES.map(c => {
        const isChecked = this.activeFilters.categories.includes(c.name);
        return `
          <label class="filter-checkbox-label">
            <span>
              <input type="checkbox" value="${c.name}" class="filter-category-check" ${isChecked ? 'checked' : ''} />
              ${c.name}
            </span>
            <span class="small text-muted-custom">(${c.count})</span>
          </label>
        `;
      }).join('');
    }

    // 3. Brand Checkboxes
    const brandContainer = document.getElementById('filterBrandsContainer');
    if (brandContainer) {
      brandContainer.innerHTML = IRONVAULT_BRANDS.map(b => {
        const isChecked = this.activeFilters.brands.includes(b.name);
        return `
          <label class="filter-checkbox-label">
            <span>
              <input type="checkbox" value="${b.name}" class="filter-brand-check" ${isChecked ? 'checked' : ''} />
              ${b.name}
            </span>
            <span class="small text-muted-custom">(${b.count})</span>
          </label>
        `;
      }).join('');
    }
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('catalogSearchInput');
    if (searchInput) {
      if (this.activeFilters.search) searchInput.value = this.activeFilters.search;
      searchInput.addEventListener('input', (e) => {
        this.activeFilters.search = e.target.value.trim().toLowerCase();
        this.applyFilters();
      });
    }

    // Goals change
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('filter-goal-check')) {
        this.updateCheckedArray('goals', '.filter-goal-check');
      } else if (e.target.classList.contains('filter-category-check')) {
        this.updateCheckedArray('categories', '.filter-category-check');
      } else if (e.target.classList.contains('filter-brand-check')) {
        this.updateCheckedArray('brands', '.filter-brand-check');
      }
    });

    // Price range slider
    const priceSlider = document.getElementById('priceRangeSlider');
    const priceLabel = document.getElementById('priceRangeLabel');
    if (priceSlider && priceLabel) {
      priceSlider.addEventListener('input', (e) => {
        this.activeFilters.maxPrice = parseFloat(e.target.value);
        priceLabel.textContent = `$${this.activeFilters.maxPrice}`;
        this.applyFilters();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.activeFilters.sort = e.target.value;
        this.applyFilters();
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetAllFilters());
    }
  },

  updateCheckedArray(key, selector) {
    const checked = Array.from(document.querySelectorAll(`${selector}:checked`)).map(el => el.value);
    this.activeFilters[key] = checked;
    this.applyFilters();
  },

  resetAllFilters() {
    this.activeFilters = {
      search: '',
      goals: [],
      categories: [],
      brands: [],
      maxPrice: 100,
      sort: 'featured'
    };

    document.querySelectorAll('.filter-goal-check, .filter-category-check, .filter-brand-check').forEach(el => el.checked = false);
    const searchInput = document.getElementById('catalogSearchInput');
    if (searchInput) searchInput.value = '';
    const priceSlider = document.getElementById('priceRangeSlider');
    const priceLabel = document.getElementById('priceRangeLabel');
    if (priceSlider) priceSlider.value = 100;
    if (priceLabel) priceLabel.textContent = '$100';
    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) sortSelect.value = 'featured';

    this.applyFilters();
    IRONVAULT_STORE.showToast('All filters cleared', 'rotate-ccw');
  },

  applyFilters() {
    let results = IRONVAULT_PRODUCTS.filter(p => {
      // 1. Search text
      if (this.activeFilters.search) {
        const query = this.activeFilters.search;
        const matches = p.name.toLowerCase().includes(query) ||
                        p.brand.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // 2. Goal filter
      if (this.activeFilters.goals.length > 0) {
        if (!this.activeFilters.goals.includes(p.goal)) return false;
      }

      // 3. Category filter
      if (this.activeFilters.categories.length > 0) {
        if (!this.activeFilters.categories.includes(p.category)) return false;
      }

      // 4. Brand filter
      if (this.activeFilters.brands.length > 0) {
        if (!this.activeFilters.brands.includes(p.brand)) return false;
      }

      // 5. Price filter
      if (p.price > this.activeFilters.maxPrice) {
        return false;
      }

      return true;
    });

    // Apply Sorting
    if (this.activeFilters.sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (this.activeFilters.sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (this.activeFilters.sort === 'name-asc') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.activeFilters.sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (this.activeFilters.sort === 'newest') {
      results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    this.renderResults(results);
    this.renderActiveFilterChips();
  },

  renderResults(products) {
    const grid = document.getElementById('catalogProductsGrid');
    const countEl = document.getElementById('catalogResultsCount');
    if (countEl) countEl.textContent = `${products.length} Products Found`;

    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="p-5 bg-card-custom rounded border" style="border-color: var(--border-color) !important;">
            <i data-lucide="filter-x" style="width: 56px; height: 56px; color: var(--color-electric);" class="mb-3"></i>
            <h3 class="display-font mb-2">NO PRODUCTS MATCH CRITERIA</h3>
            <p class="text-muted-custom mb-4">Try clearing active filters or broadening your search parameters.</p>
            <button class="btn-iron btn-electric" onclick="IRONVAULT_CATALOG.resetAllFilters()">
              Clear All Filters
            </button>
          </div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="col-xl-4 col-lg-6 col-md-6 d-flex">
        <div class="product-card">
          <div class="product-card-image-wrap">
            <span class="product-badge-overlay badge-custom ${p.badgeClass}">${p.badge}</span>
            <img src="${p.image}" alt="${p.name}" class="product-card-img" />
            <button class="product-quick-view-btn" onclick="IRONVAULT_STORE.openQuickView('${p.id}')" title="Quick View">
              <i data-lucide="eye" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
          <div class="product-card-body">
            <div class="product-card-brand">${p.brand}</div>
            <h4 class="product-card-title">${p.name}</h4>
            <div class="product-card-meta">
              <span class="product-card-flavour-badge">${p.flavours[0]}</span>
              <span>${p.sizes[0]}</span>
            </div>
            <div class="product-card-price-row">
              <span class="product-card-price">$${p.price.toFixed(2)}</span>
              ${p.originalPrice ? `<span class="product-card-original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
              <span class="ms-auto small text-muted-custom">&starf; ${p.rating}</span>
            </div>
            <div class="product-card-actions">
              <button class="btn-iron btn-electric btn-sm-iron w-100" onclick="IRONVAULT_STORE.addToCart('${p.id}')">
                <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  renderActiveFilterChips() {
    const chipsContainer = document.getElementById('activeFilterChips');
    if (!chipsContainer) return;

    const chips = [];
    if (this.activeFilters.search) {
      chips.push({ label: `Search: "${this.activeFilters.search}"`, type: 'search' });
    }
    this.activeFilters.goals.forEach(g => chips.push({ label: `Goal: ${g}`, type: 'goal', val: g }));
    this.activeFilters.categories.forEach(c => chips.push({ label: `Category: ${c}`, type: 'category', val: c }));
    this.activeFilters.brands.forEach(b => chips.push({ label: `Brand: ${b}`, type: 'brand', val: b }));
    if (this.activeFilters.maxPrice < 100) {
      chips.push({ label: `Under $${this.activeFilters.maxPrice}`, type: 'price' });
    }

    if (chips.length === 0) {
      chipsContainer.innerHTML = '';
      chipsContainer.style.display = 'none';
      return;
    }

    chipsContainer.style.display = 'flex';
    chipsContainer.innerHTML = chips.map(chip => `
      <span class="badge-custom badge-pro d-inline-flex align-items-center gap-1 cursor-pointer" onclick="IRONVAULT_CATALOG.removeFilterChip('${chip.type}', '${chip.val || ''}')">
        ${chip.label} &times;
      </span>
    `).join('') + `
      <button class="btn btn-link btn-sm text-electric text-decoration-none py-0 px-1" onclick="IRONVAULT_CATALOG.resetAllFilters()">Reset All</button>
    `;
  },

  removeFilterChip(type, val) {
    if (type === 'search') {
      this.activeFilters.search = '';
      const sInput = document.getElementById('catalogSearchInput');
      if (sInput) sInput.value = '';
    } else if (type === 'goal') {
      this.activeFilters.goals = this.activeFilters.goals.filter(g => g !== val);
      const cb = document.querySelector(`.filter-goal-check[value="${val}"]`);
      if (cb) cb.checked = false;
    } else if (type === 'category') {
      this.activeFilters.categories = this.activeFilters.categories.filter(c => c !== val);
      const cb = document.querySelector(`.filter-category-check[value="${val}"]`);
      if (cb) cb.checked = false;
    } else if (type === 'brand') {
      this.activeFilters.brands = this.activeFilters.brands.filter(b => b !== val);
      const cb = document.querySelector(`.filter-brand-check[value="${val}"]`);
      if (cb) cb.checked = false;
    } else if (type === 'price') {
      this.activeFilters.maxPrice = 100;
      const slider = document.getElementById('priceRangeSlider');
      if (slider) slider.value = 100;
    }
    this.applyFilters();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  IRONVAULT_CATALOG.init();
});


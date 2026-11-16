/**
 * IRONVAULT Home 2: The Supplement Brand Marketplace Script
 * Features: Live Countdown Timer, Brand Switcher Hero, Interactive AJAX Brand Filter Tabs,
 * 4-Way Supplement Comparison Matrix, and Goal-to-Stack Configurator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initBrandSwitcherHero();
  initInteractiveBrandTabs();
  initStackConfigurator();
});

// 1. Live Flash Batch Drop Countdown Timer
function initCountdownTimer() {
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');
  if (!hoursEl || !minsEl || !secsEl) return;

  let totalSeconds = 4 * 3600 + 28 * 60 + 45; // 4h 28m 45s

  setInterval(() => {
    totalSeconds--;
    if (totalSeconds < 0) totalSeconds = 24 * 3600;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

// 2. Interactive Hero Brand Switcher
const HERO_BRAND_DATA = {
  'Optimum Nutrition': {
    title: 'OPTIMUM NUTRITION',
    desc: 'The benchmark of gold-standard whey isolates and mass gainers since 1986.',
    image: 'im/andrey-khoviakov-L5gVuzoP8DU-unsplash.jpg',
    stat: '24G Protein',
    badge: 'World #1 Whey'
  },
  'Dymatize': {
    title: 'DYMATIZE NUTRITION',
    desc: 'Pioneers in hydrolyzed microfiltered ISO100 with near-zero fat and lactose.',
    image: 'im/pexels-andres-ayrton-6551145.jpg',
    stat: 'Hydrolyzed WPI',
    badge: 'Fast Digestion'
  },
  'Myprotein': {
    title: 'MYPROTEIN LABS',
    desc: 'Precision European Creapure® creatine and certified organic vegan superfoods.',
    image: 'im/andrey-khoviakov-CywnFj7dSmo-unsplash.jpg',
    stat: '99.99% Creapure',
    badge: 'Purity Benchmark'
  },
  'MuscleTech': {
    title: 'MUSCLETECH RESEARCH',
    desc: 'Clinical nitric oxide pre-workout formulas and patent-backed athletic matrices.',
    image: 'im/pexels-krzysztof-biernat-406313862-15120889.jpg',
    stat: 'VaporX5 Stim',
    badge: 'Vascular Pump'
  },
  'GNC': {
    title: 'GNC PERFORMANCE',
    desc: 'High-potency athletic multivitamins, intra-workout EAAs, and low-sugar snacks.',
    image: 'im/andrey-khoviakov-jcc2r_QY58w-unsplash.jpg',
    stat: '39 Bio-Actives',
    badge: 'Athlete Defense'
  },
  'Isopure': {
    title: 'ISOPURE NATURE',
    desc: 'Zero-carb ion-exchange whey isolates for pure lean protein supplementation.',
    image: 'im/pexels-lpfstudio023-31443914.jpg',
    stat: 'Zero Active Carbs',
    badge: 'Zero Sugar'
  }
};

function initBrandSwitcherHero() {
  const pills = document.querySelectorAll('.brand-ticker-pill');
  const titleEl = document.getElementById('heroBrandTitle');
  const descEl = document.getElementById('heroBrandDesc');
  const imgEl = document.getElementById('heroBrandImg');
  const statEl = document.getElementById('heroBrandStat');
  const badgeEl = document.getElementById('heroBrandBadge');

  if (!pills.length || !titleEl) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const brandName = pill.textContent.trim();
      const data = HERO_BRAND_DATA[brandName];
      if (!data) return;

      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      imgEl.src = data.image;
      statEl.textContent = data.stat;
      badgeEl.textContent = data.badge;

      // Animate transition
      imgEl.style.opacity = '0.5';
      setTimeout(() => imgEl.style.opacity = '1', 150);
    });
  });
}

// 3. Interactive Brand Tabs (AJAX-Style Filter)
function initInteractiveBrandTabs() {
  const tabContainer = document.getElementById('brandFilterNav');
  const productsContainer = document.getElementById('brandTabProductsGrid');
  if (!tabContainer || !productsContainer) return;

  // Render Brands Tabs
  const uniqueBrands = ['All Brands', ...new Set(IRONVAULT_PRODUCTS.map(p => p.brand))];
  tabContainer.innerHTML = uniqueBrands.map((b, idx) => `
    <button type="button" class="brand-filter-tab ${idx === 0 ? 'active' : ''}" data-brand="${b}">
      ${b}
    </button>
  `).join('');

  function renderBrandProducts(selectedBrand) {
    let list = IRONVAULT_PRODUCTS;
    if (selectedBrand !== 'All Brands') {
      list = list.filter(p => p.brand === selectedBrand);
    }

    productsContainer.innerHTML = list.map(p => `
      <div class="col-xl-3 col-lg-4 col-md-6 d-flex" data-aos="fade-up">
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
  }

  // Initial render
  renderBrandProducts('All Brands');

  // Handle tab clicks
  tabContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('brand-filter-tab')) return;
    tabContainer.querySelectorAll('.brand-filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');

    const brand = e.target.getAttribute('data-brand');
    renderBrandProducts(brand);
  });
}

// 4. Interactive Goal-to-Stack Configurator
const STACK_PRESETS = {
  'hypertrophy': {
    title: 'THE HYPERTROPHY PROTOCOL',
    items: ['Gold Standard 100% Whey', 'Creapure® Micronized Creatine', 'Carb Killa Protein Bar'],
    ids: ['iv-gold-whey-on', 'iv-creatine-creapure', 'iv-protein-bar-grenade'],
    macros: '45g Protein / day • 5g Creatine • 215 kcal Snack',
    bundlePrice: 114.99,
    savings: 'Save $14.98'
  },
  'strength': {
    title: 'MAXIMAL STRENGTH & ATP STACK',
    items: ['NitroTech Elite Creatine', 'VaporX5 Neuro Pre-Workout', 'ISO100 Hydrolyzed Whey'],
    ids: ['iv-celltech-muscletech', 'iv-c4-ripped-pre', 'iv-iso100-dymatize'],
    macros: 'High-Stim Pump • 5g Dual-Stage Creatine • Fast Isolate',
    bundlePrice: 146.99,
    savings: 'Save $17.98'
  },
  'lean': {
    title: 'LEAN CUTTING & FAST ISOLATE',
    items: ['Zero Carb 100% Whey Isolate', 'HydraCharge BCAA + EAA', 'Mega Men Sport Multivitamin'],
    ids: ['iv-isopure-zero-carb', 'iv-xtend-bcaa-scivation', 'iv-multivitamin-animal'],
    macros: 'Zero Sugar • 7g Intra-Workout BCAAs • 39 Micronutrients',
    bundlePrice: 116.99,
    savings: 'Save $13.98'
  },
  'vegan': {
    title: 'PLANT-BASED ATHLETE MATRIX',
    items: ['Vegan Superfood Plant Protein', 'Creapure® Micronized Creatine', 'Nature’s Best Plant Organic'],
    ids: ['iv-plant-myprotein', 'iv-creatine-creapure', 'iv-plant-isopure'],
    macros: '100% Vegan EAAs • Non-GMO Pea/Rice • ATP Synthesis',
    bundlePrice: 104.99,
    savings: 'Save $11.98'
  }
};

let activeStackKey = 'hypertrophy';

function initStackConfigurator() {
  const goalButtons = document.querySelectorAll('.config-goal-btn');
  const titleEl = document.getElementById('stackTitle');
  const itemsContainer = document.getElementById('stackItemsList');
  const macrosEl = document.getElementById('stackMacros');
  const priceEl = document.getElementById('stackPrice');
  const savingsEl = document.getElementById('stackSavings');
  const addBtn = document.getElementById('stackAddToCartBtn');

  if (!goalButtons.length || !titleEl) return;

  function updateStackUI(key) {
    activeStackKey = key;
    const preset = STACK_PRESETS[key];
    if (!preset) return;

    titleEl.textContent = preset.title;
    macrosEl.textContent = preset.macros;
    priceEl.textContent = `$${preset.bundlePrice.toFixed(2)}`;
    savingsEl.textContent = preset.savings;

    itemsContainer.innerHTML = preset.items.map(item => `
      <div class="d-flex align-items-center gap-2 mb-2 p-2 bg-secondary-custom rounded small">
        <i data-lucide="check-circle" class="text-electric" style="width: 16px;"></i>
        <span>${item}</span>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  }

  goalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      goalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const goal = btn.getAttribute('data-goal');
      updateStackUI(goal);
    });
  });

  // Add Entire Stack To Cart
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const preset = STACK_PRESETS[activeStackKey];
      if (!preset) return;

      preset.ids.forEach(id => {
        IRONVAULT_STORE.addToCart(id);
      });

      IRONVAULT_STORE.showToast(`Added full ${preset.title} bundle to cart!`, 'shopping-bag');
    });
  }

  // Initial state
  updateStackUI('hypertrophy');
}

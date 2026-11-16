/**
 * IRONVAULT Home 1: The Performance Editorial Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroGSAP();
  initBestsellersSwiper();
  initReviewsSwiper();
});

// GSAP Hero Text & Visual Entrance
function initHeroGSAP() {
  if (!window.gsap) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-tag-anim', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    delay: 0.2
  })
  .from('.hero-headline-xl', {
    y: 40,
    opacity: 0,
    duration: 0.8
  }, '-=0.3')
  .from('.hero-sub-anim', {
    y: 20,
    opacity: 0,
    duration: 0.6
  }, '-=0.4')
  .from('.hero-cta-anim', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15
  }, '-=0.3')
  .from('.hero-athlete-showcase', {
    scale: 0.94,
    opacity: 0,
    duration: 1
  }, '-=0.8')
  .from('.hero-floating-stat', {
    x: -30,
    opacity: 0,
    duration: 0.6
  }, '-=0.4');
}

// Bestsellers Swiper Slider
function initBestsellersSwiper() {
  const container = document.getElementById('bestsellerSwiperWrapper');
  if (!container) return;

  // Render bestsellers from products data
  const bestsellers = IRONVAULT_PRODUCTS.filter(p => p.badge === 'Bestseller' || p.isTrending);

  container.innerHTML = bestsellers.map(p => `
    <div class="swiper-slide product-card-col">
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

  // Initialize Swiper
  new Swiper('.bestsellers-swiper', {
    slidesPerView: 1.15,
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '.bestseller-next',
      prevEl: '.bestseller-prev',
    },
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 24 },
      1200: { slidesPerView: 4, spaceBetween: 24 }
    }
  });
}

// Customer Reviews Swiper
function initReviewsSwiper() {
  const container = document.getElementById('reviewsSwiperWrapper');
  if (!container) return;

  const reviews = [
    {
      name: "Marcus Vance",
      title: "Competitive Powerlifter",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      text: "The delivery is fast, packaging is bulletproof, and the batch transparency on ISO100 is unmatched. IRONVAULT has become my mandatory prep station.",
      stars: 5,
      verified: "Verified Athlete"
    },
    {
      name: "Elena Rostova",
      title: "CrossFit Regional Athlete",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      text: "Finding Creapure® creatine with authentic German sourcing used to be a hassle. IRONVAULT's clean label vetting gives me total confidence in my daily stack.",
      stars: 5,
      verified: "Verified Athlete"
    },
    {
      name: "David Kalu",
      title: "Strength & Conditioning Coach",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      text: "I recommend IRONVAULT to all my clients. Zero confusing marketing jargon—just verified sports nutrition organized directly around tangible training goals.",
      stars: 5,
      verified: "Certified Coach"
    },
    {
      name: "Sarah Chen",
      title: "Marathon & Hyrox Competitor",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      text: "The BCAA HydraCharge electrolyte blend keeps my endurance intact during grueling 20km split sessions. Essential fuel for high-output athletes.",
      stars: 5,
      verified: "Verified Athlete"
    }
  ];

  container.innerHTML = reviews.map(r => `
    <div class="swiper-slide h-auto">
      <div class="review-card">
        <div>
          <div class="review-stars">
            ${Array(r.stars).fill('<i data-lucide="star" style="width: 18px; fill: var(--color-electric);"></i>').join('')}
          </div>
          <p class="review-quote">"${r.text}"</p>
        </div>
        <div class="review-author">
          <img src="${r.avatar}" alt="${r.name}" class="review-avatar" />
          <div>
            <h5 class="mb-0" style="font-size: 1.1rem;">${r.name}</h5>
            <small class="text-electric fw-bold d-block">${r.title}</small>
            <small class="text-muted-custom" style="font-size: 0.75rem;">${r.verified} (Demo Content)</small>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();

  new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    speed: 700,
    pagination: {
      el: '.reviews-pagination',
      clickable: true
    },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 24 },
      1200: { slidesPerView: 3, spaceBetween: 24 }
    }
  });
}


/**
 * IRONVAULT Main Application Script
 * Mobile Navigation Drawer, Three.js 3D Geometric Canvas, GSAP animations,
 * AOS initialization, Newsletter subscription, and common UI helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Initialize AOS (Animate on Scroll)
  if (window.AOS) {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  // 3. Highlight Active Navigation Links
  highlightActiveNav();

  // 4. Initialize Mobile Hamburger Offcanvas
  initMobileNav();

  // 5. Initialize Three.js 3D Background if container present
  initThreeCanvas();

  // 6. Bind Newsletter Forms
  initNewsletterForms();

  // 7. Initialize Back to Top Button
  initBackToTop();
});

// Highlight Active Nav based on current URL
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.desktop-nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Mobile Hamburger Offcanvas Controls
function initMobileNav() {
  const toggleBtn = document.getElementById('hamburgerToggleBtn');
  const closeBtn = document.getElementById('offcanvasCloseBtn');
  const drawer = document.getElementById('ironMobileOffcanvas');
  const backdrop = document.getElementById('mobileNavBackdrop');

  function openMenu() {
    if (!drawer) return;
    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!drawer) return;
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Close when clicking internal link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Three.js 3D Cyber-Geometric Background Canvas
function initThreeCanvas() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || !window.THREE) return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 1. Wireframe Geometric Core (Icosahedron)
  const geom = new THREE.IcosahedronGeometry(12, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xFFD400,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const coreMesh = new THREE.Mesh(geom, wireMat);
  scene.add(coreMesh);

  // 2. Star/Particle Field
  const particlesCount = 200;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 80;
    positions[i + 1] = (Math.random() - 0.5) * 80;
    positions[i + 2] = (Math.random() - 0.5) * 80;
  }
  const partGeom = new THREE.BufferGeometry();
  partGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0xFFD400,
    size: 0.6,
    transparent: true,
    opacity: 0.35
  });
  const particleSystem = new THREE.Points(partGeom, partMat);
  scene.add(particleSystem);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  let reqId;
  function animate() {
    reqId = requestAnimationFrame(animate);

    coreMesh.rotation.x += 0.002;
    coreMesh.rotation.y += 0.003;

    particleSystem.rotation.y -= 0.0008;

    // Subtle parallax response to mouse
    camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 4 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// Newsletter Subscription Logic
function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) return;

      const email = input.value.trim();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : '';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
      }

      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
        input.value = '';
        IRONVAULT_STORE.showToast(`Subscribed ${email} to IRONVAULT Club! (Demo)`, 'check');
      }, 700);
    });
  });
}

// 7. Back to Top Smooth Scrolling Button
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}



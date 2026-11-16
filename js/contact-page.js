/**
 * IRONVAULT Contact Page - Enquiry Form & Validation Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ironContactForm');
  if (!form) return;

  // Pre-fill enquiry type if passed in URL
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  if (typeParam) {
    const typeSelect = document.getElementById('contactType');
    if (typeSelect) {
      for (let option of typeSelect.options) {
        if (option.value.toLowerCase().includes(typeParam.toLowerCase()) || typeParam.toLowerCase().includes(option.value.toLowerCase())) {
          typeSelect.value = option.value;
          break;
        }
      }
    }
  }

  form.addEventListener('submit', handleContactSubmit);
});

function handleContactSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const typeSelect = document.getElementById('contactType');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const feedbackBox = document.getElementById('contactFormFeedback');
  const submitBtn = document.getElementById('contactSubmitBtn');

  // Clear previous errors
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  feedbackBox.style.display = 'none';

  let hasError = false;

  // Validation
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    nameInput.classList.add('is-invalid');
    hasError = true;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailInput.classList.add('is-invalid');
    hasError = true;
  }

  if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
    phoneInput.classList.add('is-invalid');
    hasError = true;
  }

  if (!subjectInput.value.trim()) {
    subjectInput.classList.add('is-invalid');
    hasError = true;
  }

  if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
    messageInput.classList.add('is-invalid');
    hasError = true;
  }

  if (hasError) {
    feedbackBox.className = 'alert alert-danger py-2 small mb-3';
    feedbackBox.innerHTML = '<i data-lucide="alert-triangle" style="width: 16px;"></i> Please correct the highlighted fields before submitting.';
    feedbackBox.style.display = 'block';
    if (window.lucide) lucide.createIcons();
    return;
  }

  // Simulate AJAX submission
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> SUBMITTING ENQUIRY...';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    feedbackBox.className = 'alert alert-success py-3 mb-4';
    feedbackBox.innerHTML = `
      <div class="d-flex align-items-center gap-2 mb-1">
        <i data-lucide="check-circle" style="width: 18px; color: #52c41a;"></i>
        <strong class="display-font text-white" style="font-size: 1.1rem;">ENQUIRY TRANSMITTED SUCCESSFULLY (DEMO)</strong>
      </div>
      <p class="small mb-0 text-white-50">
        Thank you, <strong>${nameInput.value.trim()}</strong>! Your enquiry regarding <em>${typeSelect.value}</em> has been logged in demo mode. Our support team will respond within 24 business hours.
      </p>
    `;
    feedbackBox.style.display = 'block';
    if (window.lucide) lucide.createIcons();

    IRONVAULT_STORE.showToast('Enquiry received (Demo Mode)', 'check-circle');

    // Reset Form
    e.target.reset();
  }, 1200);
}


function scrollToSection(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
}

function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileToggle = document.getElementById("mobile-menu-toggle");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  document.getElementById("logo-btn")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-scroll");
      scrollToSection(target);
      if (mobileMenu?.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        mobileToggle?.setAttribute("aria-expanded", "false");
        updateMobileMenuLabel();
      }
    });
  });

  mobileToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    updateMobileMenuLabel();
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", toggleLanguage);
  });

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-in, .observe-fade").forEach((el) => {
    observer.observe(el);
  });
}

function showToast(title, description, variant) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast${variant === "destructive" ? " destructive" : ""}`;
  toast.innerHTML = `
    <p class="toast-title">${title}</p>
    <p class="toast-desc">${description}</p>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("leaving");
    toast.addEventListener("animationend", () => toast.remove());
  }, 4000);
}

function validateContactForm(data) {
  const t = getTranslations();
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = t.contact.errors.name;
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = t.contact.errors.email;
  }
  if (!data.service) {
    errors.service = t.contact.errors.service;
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.message = t.contact.errors.message;
  }

  return errors;
}

function showFormErrors(errors) {
  document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));

  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = document.getElementById(`error-${field}`);
    if (errorEl) errorEl.textContent = message;
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      service: formData.get("service")?.toString() || "",
      message: formData.get("message")?.toString().trim() || "",
    };

    const errors = validateContactForm(data);
    if (Object.keys(errors).length > 0) {
      showFormErrors(errors);
      return;
    }

    showFormErrors({});
    const t = getTranslations();
    submitBtn.disabled = true;
    submitBtn.textContent = t.contact.submitting;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          service: data.service,
          message: data.message,
          phone: data.phone || undefined,
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      showToast(t.contact.successTitle, t.contact.successDesc);
      form.reset();
      renderServiceOptions(t.contact);
    } catch {
      showToast(t.contact.errorTitle, t.contact.errorDesc, "destructive");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = getTranslations().contact.submit;
    }
  });
}

function updateCopyrightYear() {
  const el = document.getElementById("copyright-year");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initI18n();
  initNavbar();
  initScrollAnimations();
  initContactForm();
  updateCopyrightYear();
});

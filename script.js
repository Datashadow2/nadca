/* ============================================================
   Voice for Change — Prototype Logic
   Handles: mobile nav, form validation, photo size check,
            anonymous toggle, and simulated submission.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile Navigation ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });

    // Close menu when a link is clicked (mobile UX)
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
      });
    });
  }

  /* ---------- Footer Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Anonymous Toggle ---------- */
  const anonymousCheckbox = document.getElementById("anonymous");
  const contactFields = document.getElementById("contactFields");
  const contactInput = document.getElementById("contact");

  if (anonymousCheckbox && contactFields) {
    anonymousCheckbox.addEventListener("change", function () {
      if (anonymousCheckbox.checked) {
        contactFields.style.display = "none";
        if (contactInput) contactInput.value = "";
      } else {
        contactFields.style.display = "block";
      }
    });
  }

  /* ---------- Form Handling ---------- */
  const form = document.getElementById("reportForm");
  const statusBox = document.getElementById("formStatus");

  if (!form) return;

  const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB

  /**
   * Show an inline error under a field.
   */
  function setFieldError(fieldName, message) {
    const el = document.querySelector('[data-error-for="' + fieldName + '"]');
    if (el) el.textContent = message || "";
  }

  /**
   * Clear all inline errors.
   */
  function clearErrors() {
    document.querySelectorAll(".error").forEach(function (el) {
      el.textContent = "";
    });
    if (statusBox) {
      statusBox.className = "form-status";
      statusBox.textContent = "";
    }
  }

  /**
   * Validate the form. Returns true if valid.
   */
  function validateForm() {
    let valid = true;
    clearErrors();

    const outletName = form.outletName.value.trim();
    const location = form.location.value.trim();
    const violationType = form.violationType.value;
    const description = form.description.value.trim();
    const consent = form.consent.checked;
    const photo = form.photo.files[0];

    if (!outletName) {
      setFieldError("outletName", "Please enter the outlet name.");
      valid = false;
    }

    if (!location) {
      setFieldError("location", "Please enter the location or estate.");
      valid = false;
    }

    if (!violationType) {
      setFieldError("violationType", "Please select a violation type.");
      valid = false;
    }

    if (!description) {
      setFieldError("description", "Please describe what you observed.");
      valid = false;
    }

    if (photo && photo.size > MAX_PHOTO_BYTES) {
      setFieldError("photo", "Photo must be 5MB or smaller.");
      valid = false;
    }

    if (!consent) {
      setFieldError("consent", "You must agree to the Privacy Notice.");
      valid = false;
    }

    return valid;
  }

  /**
   * Simulate submission (prototype only — no backend).
   */
  function simulateSubmission() {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({ ok: true });
      }, 900);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
      if (statusBox) {
        statusBox.className = "form-status error";
        statusBox.textContent =
          "Please fix the highlighted fields and try again.";
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    simulateSubmission().then(function (result) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      if (result.ok) {
        statusBox.className = "form-status success";
        statusBox.textContent =
          "Thank you. Your report has been received privately and will be " +
          "forwarded to the relevant authorities. Photos are never published.";
        form.reset();
        if (contactFields) contactFields.style.display = "block";
      } else {
        statusBox.className = "form-status error";
        statusBox.textContent =
          "Something went wrong. Please try again later.";
      }
    });
  });

  /* ---------- Clear field error on input ---------- */
  ["outletName", "location", "violationType", "description", "photo", "consent"].forEach(
    function (name) {
      const field = form[name];
      if (!field) return;
      const evt = field.type === "checkbox" || field.type === "file" ? "change" : "input";
      field.addEventListener(evt, function () {
        setFieldError(name, "");
      });
    }
  );
})();

const TOAST_CONTAINER_ID = "sv-toast-container";

function showToast(message, type = "success") {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = TOAST_CONTAINER_ID;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `sv-toast sv-toast-${type}`;
  toast.innerHTML = `
    <div class="sv-toast-icon">
      <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}"></i>
    </div>
    <div class="sv-toast-message">${message}</div>
    <button class="sv-toast-close" aria-label="Close notification">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  toast.querySelector(".sv-toast-close").addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form[data-formsubmit='true']");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.innerHTML : "";
      const actionUrl = form.getAttribute("action");

      if (!actionUrl) {
        console.warn("FormSubmit handler: form has no action attribute");
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      try {
        await fetch(actionUrl, {
          method: "POST",
          body: formData,
          mode: "no-cors",
        });

        showToast("Message sent successfully! We will contact you shortly.");
        form.reset();
      } catch (error) {
        console.error("FormSubmit request failed:", error);
        showToast("Something went wrong. Please try again later.", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }
      }
    });
  });
});


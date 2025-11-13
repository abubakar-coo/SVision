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

        alert("Message sent successfully!");
        form.reset();
      } catch (error) {
        console.error("FormSubmit request failed:", error);
        alert("Something went wrong. Please try again later.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }
      }
    });
  });
});


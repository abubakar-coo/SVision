const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1BfiScmnGjb2VwPEc2ZxfsKJwGClPmaQRM6T7cyC0NlX18j0EWvO8u4-6bsJXrZ2l/exec";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".js-contact-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.innerHTML : "";

      const formData = new FormData(form);
      const payload = {
        name: formData.get("name")?.trim() || "",
        email: formData.get("email")?.trim() || "",
        message: formData.get("message")?.trim() || "",
        formName: form.dataset.formName || "Website Form",
      };

      if (!payload.name || !payload.email || !payload.message) {
        alert("Please fill in your name, email, and message before submitting.");
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        alert("Message sent successfully!");
        form.reset();
      } catch (error) {
        console.error("Form submission failed:", error);
        alert("Something went wrong. Please try again later.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  });
});


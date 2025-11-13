document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form[data-formsubmit='true']");

  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonContent = submitButton ? submitButton.innerHTML : "";
      const formName = form.dataset.formName || "Website Form";
      const action = form.getAttribute("action") || "";

      if (!action.includes("formsubmit.co/")) {
        console.warn("FormSubmit handler: invalid action URL", action);
        form.submit(); // fallback
        return;
      }

      const ajaxEndpoint = action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      const formData = new FormData(form);
      formData.append("formName", formName);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      try {
        const response = await fetch(ajaxEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Request failed with status ${response.status}: ${text}`);
        }

        // Attempt to parse JSON, but it may not always be JSON on free plan
        try {
          await response.json();
        } catch (_) {
          // ignore parsing errors and proceed
        }

        alert("Message sent successfully!");
        form.reset();
      } catch (error) {
        console.error("FormSubmit AJAX submission failed, falling back.", error);
        // As a fallback, submit the form normally (will navigate away)
        form.submit();
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonContent;
        }
      }
    });
  });
});


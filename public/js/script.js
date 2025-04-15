// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Filter Updates
function updateFilterLinks() {
  const urlParams = new URLSearchParams(window.location.search);
  const country = urlParams.get("country");
  const category = urlParams.get("category");

  // Update General filter link
  const generalLink = document.querySelector(
    '.filter a.anchor[href^="/listings"]'
  );
  if (country && generalLink) {
    generalLink.href = `/listings/search?country=${country}`;
  }

  // Update category links
  if (country) {
    document.querySelectorAll(".filter a.anchor").forEach((link) => {
      if (link.href.includes("/filter/")) {
        const category = link.href.split("/").pop();
        link.href = `/listings/search?country=${country}&category=${category}`;
      }
    });
  }

  // Update price filter links
  if (country || category) {
    document.querySelectorAll(".price-menu .dropdown-item").forEach((link) => {
      const baseUrl = link.getAttribute("href").split("?")[0];
      const params = new URLSearchParams();
      if (country) params.append("country", country);
      if (category) params.append("category", category);
      link.href = `${baseUrl}${
        params.toString() ? "?" + params.toString() : ""
      }`;
    });
  }
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", () => {
  updateFilterLinks();
});

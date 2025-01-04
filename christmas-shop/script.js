document.addEventListener("DOMContentLoaded", () => {
  const burgerIcon = document.querySelector(".burger-icon");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuLinks = document.querySelectorAll(".mobile-nav a");

  // Toggle menu
  burgerIcon.addEventListener("click", () => {
    const isOpen = burgerIcon.classList.toggle("open");
    menuOverlay.classList.toggle("open");
    burgerIcon.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : ""; // Disable background scrolling
  });

  // Close menu when clicking a link
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      burgerIcon.classList.remove("open");
      menuOverlay.classList.remove("open");
      burgerIcon.setAttribute("aria-expanded", false);
      document.body.style.overflow = "";
    });
  });
});

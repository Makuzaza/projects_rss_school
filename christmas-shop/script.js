document.addEventListener("DOMContentLoaded", () => {
    const burgerIcon = document.querySelector(".burger-icon");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuLinks = document.querySelectorAll(".mobile-nav a");
    const backToTopButton = document.getElementById('back-to-top');
    const modalOverlay = document.getElementById("modal-overlay");
    const modalClose = document.getElementById("modal-close");
    const modalImage = document.getElementById("modal-image");
    const modalCategory = document.getElementById("modal-category");
    const modalName = document.getElementById("modal-name");
    const modalDescription = document.getElementById("modal-description");
    const modalSuperpowersContainer = document.getElementById("modal-superpowers-container");
    const giftList = document.querySelector('.gift-list');
    const bestGiftsContainer = document.querySelector('.best-gifts');


    // Toggle menu
    burgerIcon.addEventListener("click", () => {
        const isOpen = burgerIcon.classList.toggle("open");
        menuOverlay.classList.toggle("open");
        burgerIcon.setAttribute("aria-expanded", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : ""; // Disable background scrolling
    });

    // Close menu when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            burgerIcon.classList.remove("open");
            menuOverlay.classList.remove("open");
            burgerIcon.setAttribute("aria-expanded", false);
            document.body.style.overflow = "";
        });
    });

     // Show or hide the button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = 'flex';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

    // Scroll to top when the button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
  // Fetch the JSON file
  fetch('./gifts.json')
  .then(response => response.json())
  .then(gifts => {
      const categoryConfig = {
          "For Work": { color: "#5064d0", image: "./images/gift-for-work.png" },
          "For Health": { color: "#3f9066", image: "./images/gift-for-health.png" },
          "For Harmony": { color: "#cd71cb", image: "./images/gift-for-harmony.png" }
      };

      giftList.innerHTML = ''; // Clear existing content

      // Loop through each gift and create HTML
      gifts.forEach(gift => {
          const giftDiv = document.createElement('div');
          giftDiv.classList.add('gift');

          // Fetch category-specific properties
          const categoryInfo = categoryConfig[gift.category];
          const giftColor = categoryInfo.color;
          const giftImage = categoryInfo.image;

          giftDiv.innerHTML = `
              <img src="${giftImage}" alt="${gift.category.toLowerCase()}">
              <div class="description" style="color: ${giftColor};">
                  <h3>${gift.category}</h3>
                  <div>${gift.name}</div>
              </div>
          `;
          giftList.appendChild(giftDiv);

          // Add event listener for opening modal
          giftDiv.addEventListener("click", () => {
            modalImage.src = giftImage;
            modalCategory.style.color = giftColor;
            modalCategory.innerText = gift.category;
            modalName.innerText = gift.name;
            modalDescription.innerText = gift.description || "No additional description available.";

             // Clear previous superpowers
             modalSuperpowersContainer.innerHTML = "";

             // Add superpowers dynamically
             Object.entries(gift.superpowers).forEach(([key, value]) => {
                 const superpowerDiv = document.createElement("div");
                 superpowerDiv.classList.add("modal-superpower");

                 // Parse the numeric value
                 const numericValue = parseInt(value.replace("+", ""), 10);
                 const snowflakeCount = Math.floor(numericValue / 100);

                 // Create snowflake images
                 const snowflakes = Array.from({ length: snowflakeCount }, () =>
                     `<img src="./images/snowflake.png" alt="Snowflake" width="20" height="20">`
                 ).join("");

                 // Add content to the superpower div
                 superpowerDiv.innerHTML = `
                     <div class="key">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                     <div class="value">${value}</div>
                     <div class="snowflakes">${snowflakes}</div>
                 `;

                 modalSuperpowersContainer.appendChild(superpowerDiv);
             });

            modalOverlay.style.display = "flex";
        });
      });
  });

   // Close modal functionality
   const closeModal = () => {
    modalOverlay.style.display = "none";
    };
    
    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", event => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
});

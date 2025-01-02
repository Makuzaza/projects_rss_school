document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.getElementById('back-to-top');
    const modalOverlay = document.getElementById("modal-overlay");
    const modalClose = document.getElementById("modal-close");
    const modalImage = document.getElementById("modal-image");
    const modalCategory = document.getElementById("modal-category");
    const modalName = document.getElementById("modal-name");
    const modalDescription = document.getElementById("modal-description");
    const modalSuperpowersContainer = document.getElementById("modal-superpowers-container");
    const giftList = document.querySelector('.gift-list');
    const categoryTitles = document.querySelectorAll('.category-title');
    
    let allGifts = []; // Store all gifts for filtering

    // Set "All" category button to active on page load
    const allButton = document.querySelector('.category-title[data-category="All"]');
    if (allButton) {
        allButton.classList.add("active");
    }
        
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

      const shuffledGifts = [...gifts].sort(() => Math.random() - 0.5);

      allGifts = shuffledGifts; // Store all gifts for filtering

     // Function to render gifts based on category
     const renderGifts = (category) => {
        giftList.innerHTML = ""; // Clear the gift list
        const normalizedCategory = category.trim().toLowerCase();
        const filteredGifts = normalizedCategory === "all" 
        ? allGifts 
        : allGifts.filter(gift => gift.category.trim().toLowerCase() === normalizedCategory);

        if (filteredGifts.length === 0) {
            giftList.innerHTML = `<div class="no-gifts">No gifts found for this category.</div>`;
            return;
        }

        console.log({ category, filteredGifts });

        filteredGifts.forEach(gift => {
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
            modalDescription.innerText = gift.description;

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
                     `<img src="./images/snowflake.png" alt="Snowflake" width="16" height="16">`
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
            // Disable scroll
            document.body.style.overflow = "hidden";
        });
      });  
    };

    // Render all gifts initially
    renderGifts("All");

    // Add event listeners for category filtering
    categoryTitles.forEach(title => {
        title.addEventListener("click", () => {
            categoryTitles.forEach(t => t.classList.remove("active")); // Remove active class
            title.classList.add("active"); // Add active class to clicked category
            renderGifts(title.textContent.trim());// Render gifts based on category
        });
    });
});
     // Close modal functionality
     const closeModal = () => {
        modalOverlay.style.display = "none";
        // Enable scroll
        document.body.style.overflow = "auto";
        };
        
        modalClose.addEventListener("click", closeModal);
        modalOverlay.addEventListener("click", event => {
            if (event.target === modalOverlay) {
                closeModal();
            }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const modalOverlay = document.getElementById("modal-overlay");
    const modalClose = document.getElementById("modal-close");
    const modalImage = document.getElementById("modal-image");
    const modalCategory = document.getElementById("modal-category");
    const modalName = document.getElementById("modal-name");
    const modalDescription = document.getElementById("modal-description");
    const modalSuperpowersContainer = document.getElementById("modal-superpowers-container");
    const bestGiftsContainer = document.querySelector('.gift-home');
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const featuresContainer = document.querySelector(".features");
    const visibleArea = document.querySelector(".slider-container").offsetWidth;
    let currentPosition = 0;

    // Fetch the gifts and display the best ones on the Home page
        fetch('./gifts.json')
            .then(response => response.json())
            .then(gifts => {
                const categoryConfig = {
                    "For Work": { color: "#5064d0", image: "./images/gift-for-work.png" },
                    "For Health": { color: "#3f9066", image: "./images/gift-for-health.png" },
                    "For Harmony": { color: "#cd71cb", image: "./images/gift-for-harmony.png" }
                };

                const shuffledGifts = [...gifts].sort(() => Math.random() - 0.5);
                const bestGifts = shuffledGifts.slice(0, 4);

                bestGifts.forEach(gift => {
                    const giftDiv = document.createElement('div');
                    giftDiv.classList.add('gift');

                    const categoryInfo = categoryConfig[gift.category];
                    const giftColor = categoryInfo.color;
                    const giftImage = categoryInfo.image;

                    giftDiv.innerHTML = `
                        <img src="${giftImage}" alt="${gift.category.toLowerCase()}">
                        <div class="description" style="color: ${giftColor};">
                            <p>${gift.category}</p>
                            <div>${gift.name}</div>
                        </div>
                    `;

                    bestGiftsContainer.appendChild(giftDiv);
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
    })

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

  // Function to calculate the move amount
  function getMoveAmount() {
    const totalWidth = featuresContainer.scrollWidth;
    const screenWidth = window.innerWidth;

    // Subtract margins for screens larger than 780px
    const adjustedWidth = screenWidth > 780 ? totalWidth + 126 : totalWidth + 10; // 63px left + 63px right

    let clicks = 3; // Default for large screens

    if (screenWidth >= 769) {
      clicks = 3; // 3 clicks for wide screens
    } else {
      clicks = 6; // 6 clicks for medium screens
    }

    return (adjustedWidth - visibleArea) / clicks;
  }

  // Function to update the slider position
  function updateSliderPosition() {
    const moveAmount = getMoveAmount();

    // Prevent scrolling beyond bounds
    const maxPosition = Math.ceil((featuresContainer.scrollWidth - visibleArea) / moveAmount);
    if (currentPosition < 0) {
      currentPosition = 0;
    }
    if (currentPosition > maxPosition) {
      currentPosition = maxPosition;
    }

    // Apply smooth transform
    featuresContainer.style.transform = `translateX(-${currentPosition * moveAmount}px)`;

    // Update button states
    prevButton.disabled = currentPosition === 0;
    nextButton.disabled = currentPosition === maxPosition;
  }

  // Event listeners for buttons
  nextButton.addEventListener("click", function () {
    currentPosition++;
    updateSliderPosition();
  });

  prevButton.addEventListener("click", function () {
    currentPosition--;
    updateSliderPosition();
  });

updateSliderPosition(); // Initial position update

  // Handle window resize to reset the slider
window.addEventListener("resize", function () {
  currentPosition = 0; // Reset position
  updateSliderPosition(); // Recalculate and apply positions
  getMoveAmount(); // Recalculate move amount
});

    // Countdown timer
  function updateCountdown() {
    // Get the current time in UTC
    const now = new Date();

    // Set the New Year target time (UTC+0)
    const newYear = new Date("2026-01-01T00:00:00Z");
    
    // Calculate the difference in milliseconds
    const difference = newYear - now;

    // If the difference is positive (before New Year)
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Update the countdown display
      document.querySelector(".countdown .countdown-item:nth-of-type(1) .time").textContent = days;
      document.querySelector(".countdown .countdown-item:nth-of-type(2) .time").textContent = hours;
      document.querySelector(".countdown .countdown-item:nth-of-type(3) .time").textContent = minutes;
      document.querySelector(".countdown .countdown-item:nth-of-type(4) .time").textContent = seconds;
    } else {
      // If the countdown has reached New Year, stop updating
      clearInterval(timerInterval);
      document.querySelector(".countdown").innerHTML = "<p>Happy New Year!</p>";
    }
  }

  // Update the countdown every second
  const timerInterval = setInterval(updateCountdown, 1000);

  // Initial call to display the countdown
  updateCountdown();
});

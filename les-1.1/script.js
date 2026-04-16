document.addEventListener("DOMContentLoaded", () => {
  const CART_STORAGE_KEY = "bmwShoppingCart";
  const carousel = document.querySelector(".car-carousel");
  const cars = Array.from(document.querySelectorAll(".car-item"));
  const navButtons = document.querySelectorAll(".color-nav-btn");
  const prevBtn = navButtons[0];
  const nextBtn = navButtons[1];
  const colorButtons = document.querySelectorAll(".colors button");
  const muteButtons = document.querySelectorAll(".mute-btn");
  const cartCountElement = document.getElementById("cartCount");

  let current = 0;
  let isSliding = false;

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  }

  function updateCartCount() {
    if (!cartCountElement) {
      return;
    }

    const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
  }

  function updatePositions() {
    const len = cars.length;
    cars.forEach((car, i) => {
      car.classList.remove("far-left", "left", "center", "right", "far-right");

      if (i === (current - 2 + len) % len) car.classList.add("far-left");
      else if (i === (current - 1 + len) % len) car.classList.add("left");
      else if (i === current) car.classList.add("center");
      else if (i === (current + 1) % len) car.classList.add("right");
      else if (i === (current + 2) % len) car.classList.add("far-right");
      else car.classList.add("far-right"); // optional: hide anything further away
    });
  }

  function slide(direction = "next") {
    if (isSliding) return;
    isSliding = true;

    if (direction === "next") {
      current = (current + 1) % cars.length;
    } else {
      current = (current - 1 + cars.length) % cars.length;
    }

    updatePositions();

    colorButtons.forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.color === cars[current].dataset.color
      );
    });

    isSliding = false;
  }

  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedColor = btn.dataset.color;

      const newIndex = cars.findIndex(car =>
        car.dataset.color === selectedColor
      );

      if (newIndex === -1) return;

      current = newIndex;
      updatePositions();

      colorButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  muteButtons.forEach(btn => {
        const video = btn.closest(".car-media").querySelector("video");
        btn.addEventListener("click", () => {
            if(video.muted){
                video.muted = false;
                btn.textContent = "🔊"; // unmute icon
            } else {
                video.muted = true;
                btn.textContent = "🔇"; // mute icon
            }
        });
    });

  nextBtn.addEventListener("click", () => slide("next"));
  prevBtn.addEventListener("click", () => slide("prev"));

  updatePositions();
  updateCartCount();

  const comparisonCards = document.querySelectorAll(".comparison .car.card");

  comparisonCards.forEach(card => {
    const video = card.querySelector("video");
    const img = card.querySelector("img");

    if (!video || !img) return;

    card.addEventListener("mouseenter", () => {
      video.play();
      img.style.opacity = "0";
      video.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
      img.style.opacity = "1";
      video.style.opacity = "0";
    });
  });
});

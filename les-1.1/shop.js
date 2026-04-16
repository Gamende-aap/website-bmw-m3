// shop.js

const cars = [
  { id: 1, name: "BMW M4 G82", type: "coupe", power: 503, price: 119900, image: "images/bmw-m4-g82.png" },
  { id: 2, name: "BMW M2 Competition", type: "coupe", power: 405, price: 78900, image: "images/BMW-M2-Comp.png" },
  { id: 3, name: "BMW 2 Series Coupe", type: "coupe", power: 255, price: 52900, image: "images/bmw-m2-coupe.png" },
  { id: 4, name: "BMW X5 M", type: "suv", power: 600, price: 144500, image: "images/BMW-X5-M-model.png" },
  { id: 5, name: "BMW X3 M Competition", type: "suv", power: 503, price: 104300, image: "images/bmw-x3m.png" },
  { id: 6, name: "BMW X1 xDrive", type: "suv", power: 228, price: 48900, image: "images/bmw-x1.png" },
  { id: 7, name: "BMW M5 Competition", type: "sedan", power: 625, price: 154900, image: "images/bmw-m5.png" },
  { id: 8, name: "BMW M3 Competition", type: "sedan", power: 503, price: 117900, image: "images/bmw-m3.png" },
  { id: 9, name: "BMW Z4 M40i", type: "convertible", power: 382, price: 73400, image: "images/bmw-z4.png" },
  { id: 10, name: "BMW M8 Coupe", type: "coupe", power: 600, price: 178900, image: "images/bmw-m8.png" },
  { id: 11, name: "BMW M2 CS", type: "coupe", power: 444, price: 98900, image: "images/bmw-m2-cs.png" },
  { id: 12, name: "BMW X7 M50i", type: "suv", power: 523, price: 132500, image: "images/bmw-x7.png" },
  { id: 13, name: "BMW M340i xDrive", type: "sedan", power: 382, price: 71900, image: "images/bmw-m340i.png" },
  { id: 14, name: "BMW M440i Gran Coupe", type: "gran coupe", power: 382, price: 68900, image: "images/bmw-m440i.png" }
];

const CART_STORAGE_KEY = "bmwShoppingCart";
const carsContainer = document.getElementById('carsContainer');
const cartCountElement = document.getElementById("cartCount");

let selectedType = "";
let selectedPower = "";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalItems;
}

function formatPrice(price) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(price);
}

function addToCart(carId) {
  const selectedCar = cars.find((car) => car.id === carId);

  if (!selectedCar) {
    return;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === carId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...selectedCar, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

/* ================= RENDER ================= */
function renderCars(filteredCars) {
  carsContainer.innerHTML = '';

  filteredCars.forEach(car => {
    const carDiv = document.createElement('div');
    carDiv.className = 'car';

    carDiv.innerHTML = `
      <div class="car-media">
        <img src="${car.image}" alt="${car.name}" />
        <div class="car-overlay">
          <button>View Details</button>
        </div>
      </div>
      <div class="card-content">
        <h3>${car.name}</h3>
        <div class="spec-grid">
          <div><span>Type</span><p>${car.type}</p></div>
          <div><span>Power</span><p>${car.power} hp</p></div>
        </div>
        <p class="item-price">${formatPrice(car.price)}</p>
        <button type="button" data-add-to-cart="${car.id}">Add to cart</button>
      </div>
    `;

    carsContainer.appendChild(carDiv);
  });
}

/* ================= FILTER ================= */
function filterCars() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const sortValue = document.getElementById("sortFilter")?.value;

  let filtered = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm);

    const matchesType = selectedType === "" || car.type.includes(selectedType);

    const matchesPower =
      selectedPower === "" ||
      (selectedPower === "300" && car.power <= 300) ||
      (selectedPower === "500" && car.power >= 500);

    return matchesSearch && matchesType && matchesPower;
  });

  if (sortValue === "power-high") {
    filtered.sort((a, b) => b.power - a.power);
  } else if (sortValue === "power-low") {
    filtered.sort((a, b) => a.power - b.power);
  }

  renderCars(filtered);
}

/* ================= EVENT LISTENERS ================= */

document.getElementById('searchInput').addEventListener('input', filterCars);

document.querySelectorAll("#typeFilter button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#typeFilter button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    selectedType = btn.dataset.type;
    filterCars();
  });
});

document.querySelectorAll("#powerFilter button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#powerFilter button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    selectedPower = btn.dataset.power;
    filterCars();
  });
});

document.getElementById("sortFilter")?.addEventListener("change", filterCars);

carsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-add-to-cart]");

  if (!button) {
    return;
  }

  addToCart(Number(button.dataset.addToCart));
});

/* ================= INIT ================= */
updateCartCount();
renderCars(cars);

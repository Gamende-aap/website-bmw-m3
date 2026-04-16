const CART_STORAGE_KEY = "bmwShoppingCart";

const cartItemsContainer = document.getElementById("cartItems");
const cartCountElement = document.getElementById("cartCount");
const cartStatusElement = document.getElementById("cartStatus");
const summaryItemsElement = document.getElementById("summaryItems");
const summarySubtotalElement = document.getElementById("summarySubtotal");
const summaryTotalElement = document.getElementById("summaryTotal");
const clearCartButton = document.getElementById("clearCartButton");

function getCart() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(price);
}

function updateCartCount(cart) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalItems;
}

function renderEmptyState() {
  cartItemsContainer.innerHTML = `
    <div class="empty-cart">
      <h3>Your cart is still empty</h3>
      <p class="subtle-text">Add a few BMW models from the shop page and they will appear here.</p>
    </div>
  `;

  cartStatusElement.textContent = "No cars added yet";
  summaryItemsElement.textContent = "0";
  summarySubtotalElement.textContent = formatPrice(0);
  summaryTotalElement.textContent = formatPrice(0);
}

function renderCart() {
  const cart = getCart();
  updateCartCount(cart);

  if (cart.length === 0) {
    renderEmptyState();
    return;
  }

  cartItemsContainer.innerHTML = "";

  let totalItems = 0;
  let subtotal = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
    subtotal += item.price * item.quantity;

    const cartItem = document.createElement("article");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-media">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div>
        <h3>${item.name}</h3>
        <div class="cart-item-specs">
          <span>${item.type}</span>
          <span>${item.power} hp</span>
          <span>Qty: ${item.quantity}</span>
        </div>
        <p class="item-price">${formatPrice(item.price * item.quantity)}</p>
      </div>
      <div class="item-actions">
        <div class="quantity-controls">
          <button type="button" class="secondary-button" data-action="decrease" data-id="${item.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button type="button" class="plus-button" data-action="increase" data-id="${item.id}">+</button>
        </div>
        <button type="button" class="secondary-button" data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartStatusElement.textContent = `${totalItems} car${totalItems === 1 ? "" : "s"} ready for checkout`;
  summaryItemsElement.textContent = `${totalItems}`;
  summarySubtotalElement.textContent = formatPrice(subtotal);
  summaryTotalElement.textContent = formatPrice(subtotal);
}

function updateItemQuantity(itemId, change) {
  const cart = getCart()
    .map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      return { ...item, quantity: item.quantity + change };
    })
    .filter((item) => item.quantity > 0);

  saveCart(cart);
  renderCart();
}

function removeItem(itemId) {
  const cart = getCart().filter((item) => item.id !== itemId);
  saveCart(cart);
  renderCart();
}

cartItemsContainer.addEventListener("click", (event) => {
  console.log(event.target);
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const itemId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") {
    updateItemQuantity(itemId, 1);
  }

  if (action === "decrease") {
    updateItemQuantity(itemId, -1);
  }

  if (action === "remove") {
    removeItem(itemId);
  }
});

clearCartButton.addEventListener("click", () => {
  saveCart([]);
  renderCart();
});

renderCart();

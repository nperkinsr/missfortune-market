const products = [
  {
    id: 1,
    name: "Screaming Candle",
    description: "Lets out a long wail when lit. Neighbours may complain.",
    price: 12.49,
    imageUrl: "assets/candle.jpg",
  },
  {
    id: 2,
    name: "Jealous Umbrella",
    description: "Snaps shut if you even glance at another umbrella.",
    price: 18.2,
    imageUrl: "assets/umbrella.jpg",
  },
  {
    id: 3,
    name: "Breadcrumb Compass",
    description: "Always points to stale toast. Not reliable for travel.",
    price: 9.99,
    imageUrl: "assets/compass.jpg",
  },
  {
    id: 4,
    name: "Suspicious Plant Pot",
    description: "Murmurs when you leave the room. Soil smells weird.",
    price: 15.75,
    imageUrl: "assets/pot.jpg",
  },
  {
    id: 5,
    name: "Yawning Picture Frame",
    description: "Yawns loudly during meetings. Deeply contagious.",
    price: 11.35,
    imageUrl: "assets/picture-frame.jpg",
  },
  {
    id: 6,
    name: "Spiteful Doormat",
    description: "Insults everyone who wipes their feet. Especially guests.",
    price: 14.1,
    imageUrl: "assets/welcome.jpg",
  },
  {
    id: 7,
    name: "Cursed Toothbrush",
    description: "Whispers regrets in Latin while you brush. Still minty.",
    price: 6.5,
    imageUrl: "assets/toothbrush.jpg",
  },
  {
    id: 8,
    name: "Unblinking Plush Toy",
    description: "Never blinks. Knows your schedule. Judges your life.",
    price: 16.95,
    imageUrl: "assets/plushy.jpg",
  },
  {
    id: 9,
    name: "The Key to Nothing",
    description: "Opens absolutely nothing. Still feels oddly important.",
    price: 7.7,
    imageUrl: "assets/key.jpg",
  },
];

// --- DOM Caching ---
const productsContainer = document.getElementById("products-container");
const basket = document.querySelector(".basket");
const basketItemsContainer = basket.querySelector(".basket-items");
const basketCount = basket.querySelector("h2 span");
const placeholderIcon = basket.querySelector(".placeholder-cart");
const placeholderText = basket.querySelector("p");
const confirmBtn = basket.querySelector(".confirm-order-btn");

// --- State ---
const cartItems = {};
const cartOrder = [];

// --- Product Card Rendering & Event Binding ---
products.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.innerHTML = `
    <div class="image-wrapper">
      <img src="${product.imageUrl}" alt="${
    product.name
  }" class="product-image" />
    </div>
    <button class="cart-button">
      <span class="label"><i class="bi bi-cart2"></i> Add to cart</span>
    </button>
    <h3 class="product-name">${product.name}</h3>
    <p class="product-description">${product.description}</p>
    <p class="product-price">€${product.price.toFixed(2)}</p>
  `;
  productsContainer.appendChild(card);

  const cartBtn = card.querySelector(".cart-button");
  let quantity = 0;

  function renderCartButton() {
    if (quantity <= 0) {
      cartBtn.classList.remove("active");
      cartBtn.innerHTML = `<span class="label"><i class="bi bi-cart2"></i> Add to cart</span>`;
      removeFromCart(product.id);
      return;
    }
    cartBtn.classList.add("active");
    cartBtn.innerHTML = `
      <div class="quantity-controls">
        <button class="circle-button minus"><i class="bi bi-dash-circle-fill"></i></button>
        <span class="label">${quantity}</span>
        <button class="circle-button plus"><i class="bi bi-plus-circle-fill"></i></button>
      </div>
    `;
    updateCart(product.id, quantity);

    cartBtn.querySelector(".plus").addEventListener("click", (e) => {
      e.stopPropagation();
      quantity++;
      renderCartButton();
    });
    cartBtn.querySelector(".minus").addEventListener("click", (e) => {
      e.stopPropagation();
      quantity--;
      renderCartButton();
    });
  }

  cartBtn.addEventListener("click", (e) => {
    if (e.target.closest(".circle-button")) return;
    if (!cartBtn.classList.contains("active")) {
      quantity = 1;
      renderCartButton();
    }
  });
});

// --- Basket Logic ---
function updateCart(productId, quantity) {
  if (cartItems[productId]) {
    cartItems[productId].quantity = quantity;
    if (quantity <= 0) removeFromCart(productId);
  } else if (quantity > 0) {
    cartItems[productId] = {
      product: products.find((p) => p.id === productId),
      quantity,
    };
    if (!cartOrder.includes(productId)) cartOrder.push(productId);
  }
  renderBasket();
}

function removeFromCart(productId) {
  delete cartItems[productId];
  const idx = cartOrder.indexOf(productId);
  if (idx !== -1) cartOrder.splice(idx, 1);
  renderBasket();
}

// --- Basket UI Rendering ---
function renderBasket() {
  // Clear previous items and order total
  basketItemsContainer.innerHTML = "";

  // Empty basket state
  if (cartOrder.length === 0) {
    placeholderIcon.style.display = "";
    placeholderText.style.display = "";
    basketCount.textContent = 0;
    if (confirmBtn) confirmBtn.style.display = "none";
    return;
  }

  // Hide placeholders
  placeholderIcon.style.display = "none";
  placeholderText.style.display = "none";

  // Render basket items
  let totalCount = 0;
  let orderTotal = 0;
  cartOrder.forEach((productId) => {
    const { product, quantity } = cartItems[productId];
    totalCount += quantity;
    orderTotal += product.price * quantity;

    const item = document.createElement("div");
    item.classList.add("basket-item");
    item.innerHTML = `
      <div class="product-grid">
        <img src="${product.imageUrl}" alt="${
      product.name
    }" class="product-thumb" />
        <div class="product-details">
          <div class="product-title">${product.name}</div>
          <div class="product-quantity">Quantity: ${quantity}</div>
        </div>
        <div class="product-pricing">
          <div class="unit-price">€${product.price.toFixed(2)}</div>
          <div class="total-price">€${(product.price * quantity).toFixed(
            2
          )}</div>
        </div>
      </div>
    `;
    basketItemsContainer.appendChild(item);
  });

  // Render order total grid
  const orderTotalGrid = document.createElement("div");
  orderTotalGrid.className = "order-total-grid";
  orderTotalGrid.innerHTML = `
    <div class="order-total-label">Order Total</div>
    <div class="order-total-value">€${orderTotal.toFixed(2)}</div>
  `;
  basketItemsContainer.appendChild(orderTotalGrid);

  basketCount.textContent = totalCount;
  if (confirmBtn) confirmBtn.style.display = "block";
}

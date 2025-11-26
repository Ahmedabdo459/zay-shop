// ===============================
// Cart Management for Cart Page
// ===============================

// Initialize cart for cart page
function initializeCartPage() {
  console.log("Initializing cart page...");
  
  // Use the global cart from main.js
  if (!window.cart) {
      window.cart = JSON.parse(localStorage.getItem("cart")) || [];
  }
  
  // Clean and validate cart data
  window.cart = window.cart.filter(item => item && item.name && item.price);
  
  window.cart.forEach(item => {
      if (!item.id) item.id = `cart-${Date.now()}-${Math.random()}`;
      if (!item.quantity) item.quantity = 1;
      if (typeof item.price === 'string') item.price = parseFloat(item.price);
  });
  
  localStorage.setItem("cart", JSON.stringify(window.cart));
  updateCartCount();
  displayCart();
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;
  
  const totalItems = window.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems === 0 ? "none" : "flex";
}

// Display cart items
function displayCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const cartSummary = document.getElementById("cartSummary");
  const totalPriceEl = document.getElementById("totalPrice");
  
  if (!cartItemsContainer) return;

  console.log("Displaying cart items:", window.cart);

  if (window.cart.length === 0) {
      if (emptyCart) emptyCart.style.display = "block";
      if (cartSummary) cartSummary.classList.add("hidden");
      cartItemsContainer.innerHTML = "";
      if (totalPriceEl) totalPriceEl.textContent = "$0.00";
      return;
  }

  if (emptyCart) emptyCart.style.display = "none";
  if (cartSummary) cartSummary.classList.remove("hidden");

  let html = "";
  let total = 0;

  window.cart.forEach(item => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      total += itemTotal;

      html += `
          <div class="flex flex-col sm:flex-row items-center gap-4 p-4 border-b">
              <img src="${item.image || './assets/img/placeholder.jpg'}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg" />
              <div class="flex-1 text-center sm:text-left">
                  <h3 class="text-xl font-semibold">${item.name}</h3>
                  <p class="text-gray-500 text-sm">${item.description || 'No description'}</p>
                  <p class="text-green-600 font-bold">$${(item.price || 0).toFixed(2)}</p>
              </div>
              <div class="flex flex-col sm:flex-row items-center gap-4">
                  <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                      <button onclick="cartDecrease('${item.id}')" class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition">
                          <i class="fa-solid fa-minus"></i>
                      </button>
                      <span class="text-xl font-bold w-12 text-center">${item.quantity || 1}</span>
                      <button onclick="cartIncrease('${item.id}')" class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition">
                          <i class="fa-solid fa-plus"></i>
                      </button>
                  </div>
                  <div class="text-center">
                      <p class="text-xl font-bold text-green-600">$${itemTotal.toFixed(2)}</p>
                      <button onclick="cartRemove('${item.id}')" class="text-red-600 hover:underline mt-2">Delete</button>
                  </div>
              </div>
          </div>
      `;
  });

  cartItemsContainer.innerHTML = html;
  if (totalPriceEl) totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

// Cart functions
function cartIncrease(id) {
  console.log("Increasing quantity for:", id);
  const item = window.cart.find(i => i.id === id);
  if (item) {
      item.quantity = (item.quantity || 1) + 1;
      localStorage.setItem("cart", JSON.stringify(window.cart));
      displayCart();
      updateCartCount();
  }
}

function cartDecrease(id) {
  console.log("Decreasing quantity for:", id);
  const item = window.cart.find(i => i.id === id);
  if (item) {
      if ((item.quantity || 1) > 1) {
          item.quantity = (item.quantity || 1) - 1;
      } else {
          window.cart = window.cart.filter(i => i.id !== id);
      }
      localStorage.setItem("cart", JSON.stringify(window.cart));
      displayCart();
      updateCartCount();
  }
}

function cartRemove(id) {
  console.log("Removing item:", id);
  if (confirm("Are you sure you want to remove this item from cart?")) {
      window.cart = window.cart.filter(i => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(window.cart));
      displayCart();
      updateCartCount();
  }
}

// Checkout function
function setupCheckout() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function() {
          if (window.cart.length === 0) {
              alert("Cart is empty");
              return;
          }
          
          if (confirm("Are you sure you want to checkout?")) {
              alert("Thank you! Order will be completed soon.");
              window.cart = [];
              localStorage.setItem("cart", JSON.stringify(window.cart));
              displayCart();
              updateCartCount();
          }
      });
  }
}

// Initialize when cart page loads
document.addEventListener("DOMContentLoaded", function() {
  console.log("Cart page loaded");
  initializeCartPage();
  setupCheckout();
});

// Make functions globally available
window.cartIncrease = cartIncrease;
window.cartDecrease = cartDecrease;
window.cartRemove = cartRemove;
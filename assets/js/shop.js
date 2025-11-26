// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart function
function addToCart(name, price, image, description) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: `cart-item-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      name,
      price,
      image,
      description,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("The product has been added to the cart!");
}

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems === 0 ? "none" : "flex";
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

updateCartCount();

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}


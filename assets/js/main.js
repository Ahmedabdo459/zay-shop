// Cart Management - Fixed Version
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Initialize cart on page load
function initializeCart() {
    // Clean invalid items
    cart = cart.filter(item => item && item.name && item.price);
    
    // Ensure proper structure
    cart.forEach((item, index) => {
        if (!item.id) item.id = `cart-${Date.now()}-${index}`;
        if (!item.quantity) item.quantity = 1;
        if (typeof item.price === 'string') item.price = parseFloat(item.price);
    });
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems === 0 ? "none" : "flex";
}

// Add item to cart - FIXED FUNCTION
function addToCart(name, price, image, description) {
    // Generate unique ID
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if item exists
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
        // Increase quantity if exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            image: image,
            description: description,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show confirmation
    alert(`${name} added to cart!`);
    
    console.log("Cart updated:", cart);
}

// Fallback Search Data
const fallbackSearchItems = [
  {
    name: "Classic Watch Collection",
    description: "Luxury automatic and quartz watches curated from top designers.",
    link: "shop.html",
  },
  {
    name: "Performance Sneakers",
    description: "Lightweight trainers engineered for movement and breathability.",
    link: "shop.html",
  },
  {
    name: "Artisan Accessories",
    description: "Handcrafted jewelry, belts, and small leather goods.",
    link: "shop.html",
  },
  {
    name: "Leather Gym Duffel",
    description: "Full-grain leather gym bag with ventilated shoe pocket.",
    link: "shop.html",
  },
  {
    name: "City Runner Sneakers",
    description: "Featherweight knit sneakers for daily runs.",
    link: "shop.html",
  },
  {
    name: "Summer Canvas Trainers",
    description: "Breathable canvas trainers with contrast trims.",
    link: "shop.html",
  },
  {
    name: "Gym Weight Set",
    description: "Adjustable dumbbells and weight plates for strength training.",
    link: "shop.html",
  },
  {
    name: "Streetwear Sneakers",
    description: "Chunky sole sneaker with suede overlays.",
    link: "shop.html",
  },
  {
    name: "Summer Adidas Sneakers",
    description: "Retro Adidas sneakers with breathable mesh.",
    link: "shop.html",
  },
  {
    name: "Smart Fitness Watch",
    description: "AMOLED fitness watch with heart rate tracking.",
    link: "shop.html",
  },
];

// Navigation Active State - FIXED
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('text-green-600', 'font-bold', 'active');
        
        const linkHref = link.getAttribute('href');
        
        // Check for exact match
        if (linkHref === currentPage) {
            link.classList.add('text-green-600', 'font-bold', 'active');
        }
        
        // Check for home page
        if ((currentPage === 'index.html' || currentPage === '') && 
            (linkHref === 'index.html' || linkHref === './' || linkHref === '#')) {
            link.classList.add('text-green-600', 'font-bold', 'active');
        }
        
        // Check for hash links on home page
        if (currentPage === 'index.html' && linkHref.startsWith('#')) {
            const sectionId = linkHref.substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    link.classList.add('text-green-600', 'font-bold', 'active');
                }
            }
        }
    });
}

// Mobile Menu Toggle - FINAL FIXED VERSION
function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    console.log("Mobile Menu Setup:", { menuBtn, mobileMenu });
    
    if (menuBtn && mobileMenu) {
        // Remove any existing event listeners by cloning and replacing
        const newMenuBtn = menuBtn.cloneNode(true);
        menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
        
        // Add fresh click event
        newMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log("Menu button clicked - Working!");
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                console.log("Menu closed after link click");
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.classList.contains('hidden') && 
                !mobileMenu.contains(e.target) && 
                e.target !== newMenuBtn && 
                !newMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                console.log("Menu closed by outside click");
            }
        });
        
        console.log("Mobile menu setup complete");
    } else {
        console.log("Mobile menu elements not found");
    }
}

// Search Functionality - FIXED
function setupSearchFunctionality() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchOpenBtns = document.querySelectorAll('[data-action="open-search"]');
    const searchCloseBtn = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchSubmit = document.getElementById('searchSubmit');

    let cachedSearchItems = [];

    // Build search index
    const buildSearchIndex = () => {
        const domItems = Array.from(document.querySelectorAll(".search-item")).map((el) => ({
            name: el.dataset.name || el.textContent.trim(),
            description: el.dataset.description || "",
            link: el.dataset.link || "#",
        }));

        // Use fallback if no DOM items found
        if (!domItems.length) {
            return fallbackSearchItems;
        }

        // Merge and remove duplicates
        const seen = new Set();
        const merged = [];

        [...domItems, ...fallbackSearchItems].forEach((item) => {
            const key = item.name.toLowerCase();
            if (seen.has(key)) return;
            
            seen.add(key);
            merged.push(item);
        });

        return merged;
    };

    // Render search results
    const renderSearchResults = (query = "") => {
        if (!searchResults) return;

        // Build search index if empty
        if (!cachedSearchItems.length) {
            cachedSearchItems = buildSearchIndex();
        }

        const normalizedQuery = query.trim().toLowerCase();
        let filtered = cachedSearchItems;

        // Filter results
        if (normalizedQuery) {
            filtered = cachedSearchItems.filter(
                (item) =>
                    item.name.toLowerCase().includes(normalizedQuery) ||
                    item.description.toLowerCase().includes(normalizedQuery)
            );
        }

        // Display results or message
        if (!filtered.length && normalizedQuery) {
            searchResults.innerHTML = `<p class="text-red-500 text-sm p-3">No results found for "${query}"</p>`;
        } else if (!filtered.length) {
            searchResults.innerHTML = `<p class="text-gray-500 text-sm p-3">Start typing to search products</p>`;
        } else {
            searchResults.innerHTML = filtered
                .map(
                    (item) => `
                    <a href="${item.link}" class="block border border-gray-200 rounded-xl p-4 hover:border-green-600 hover:bg-green-50 transition mb-2">
                        <h4 class="text-lg font-semibold text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">${item.description}</p>
                    </a>
                `
                )
                .join("");
        }
    };

    // Open search overlay
    const openSearch = () => {
        if (!searchOverlay) return;
        
        searchOverlay.classList.remove('hidden');
        searchOverlay.classList.add('flex');
        
        if (searchInput) {
            searchInput.value = '';
            setTimeout(() => searchInput.focus(), 100);
        }
        
        renderSearchResults();
    };

    // Close search overlay
    const closeSearch = () => {
        if (!searchOverlay) return;
        
        searchOverlay.classList.add('hidden');
        searchOverlay.classList.remove('flex');
    };

    // Event listeners for search
    searchOpenBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openSearch();
        });
    });

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', closeSearch);
    }

    // Close on outside click
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
    }

    // Search on input
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            renderSearchResults(e.target.value);
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderSearchResults(this.value);
            }
        });
    }

    // Search submit button
    if (searchSubmit) {
        searchSubmit.addEventListener('click', function(e) {
            e.preventDefault();
            renderSearchResults(searchInput?.value || "");
        });
    }

    // Close search when result is clicked
    if (searchResults) {
        searchResults.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link) {
                closeSearch();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay && !searchOverlay.classList.contains('hidden')) {
            closeSearch();
        }
    });
}

// Smooth Scrolling - FIXED
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle hash links, not page links
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL
                history.pushState(null, null, href);
            }
        });
    });
}

// Contact Form Handler
function setupContactForm() {
    const contactForm = document.querySelector('form');
    if (contactForm && !contactForm.action) { // Only handle static forms
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
}

// Initialize Everything - FIXED
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Zay Shop...");
    
    // Initialize core functionality
    initializeCart();
    setupMobileMenu(); 
    setupSearchFunctionality();
    setupSmoothScrolling();
    setupContactForm();
    
    // Set initial active nav link
    setActiveNavLink();
    
    // Update active nav link on scroll
    window.addEventListener('scroll', setActiveNavLink);
    
    console.log("Shop initialized successfully");
    console.log("Cart items:", cart);
});

// Make functions globally available
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
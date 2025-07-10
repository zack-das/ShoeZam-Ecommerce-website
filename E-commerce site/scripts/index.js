// Redirect to login when trying to access protected pages
        document.getElementById('products-link').addEventListener('click', function(e) {
            e.preventDefault();
            if (!localStorage.getItem('isLoggedIn')) {
                window.location.href = '/E-commerce site/login.html';
            } else {
                window.location.href = '/E-commerce site/products.html';
            }
        });

        document.getElementById('shop-now').addEventListener('click', function(e) {
            e.preventDefault();
            if (!localStorage.getItem('isLoggedIn')) {
                window.location.href = './E-commerce site/login.html';
            } else {
                window.location.href = './E-commerce site/products.html';
            }
        });

        document.getElementById('login-link').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './E-commerce site/login.html';
        });

        document.getElementById('cart-link').addEventListener('click', function(e) {
            e.preventDefault();
            if (!localStorage.getItem('isLoggedIn')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'cart.html';
            }
        });

        // Add this to your existing JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuOverlay.style.display = 'flex';
    });
    
    // Close mobile menu
    mobileMenuClose.addEventListener('click', function() {
        mobileMenuOverlay.style.display = 'none';
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-menu-content a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuOverlay.style.display = 'none';
        });
    });
    
    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
        mobileThemeToggle.checked = true;
    }
    
 document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    
    // Set initial toggle state
    if (themeToggle) themeToggle.checked = currentTheme === 'dark';
    if (mobileThemeToggle) mobileThemeToggle.checked = currentTheme === 'dark';
    
    // Theme toggle event listeners
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            toggleTheme(this.checked);
        });
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', function() {
            toggleTheme(this.checked);
            if (themeToggle) themeToggle.checked = this.checked;
        });
    }
    
    function toggleTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Sync both toggles
        if (themeToggle) themeToggle.checked = isDark;
        if (mobileThemeToggle) mobileThemeToggle.checked = isDark;
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuOverlay.style.display = 'flex';
        });
        
        mobileMenuClose.addEventListener('click', function() {
            mobileMenuOverlay.style.display = 'none';
        });
    }
});
    
    // Mobile menu links functionality
    document.getElementById('mobile-products-link').addEventListener('click', function(e) {
        e.preventDefault();
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'products.html';
        }
    });
    
    document.getElementById('mobile-login-link').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'login.html';
    });
    
    document.getElementById('mobile-cart-link').addEventListener('click', function(e) {
        e.preventDefault();
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'cart.html';
        }
    });
    
    // Update cart count in mobile menu
    function updateMobileCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.mobile-cart-count').textContent = totalItems;
    }
    
    updateMobileCartCount();
});

// Update this function in your existing code
function updateNav() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginLinks = document.querySelectorAll('#login-link, #mobile-login-link');
    const logoutLinks = document.querySelectorAll('#logout-link, #mobile-logout-link');
    
    if (isLoggedIn) {
        loginLinks.forEach(link => link.style.display = 'none');
        logoutLinks.forEach(link => link.style.display = 'block');
    } else {
        loginLinks.forEach(link => link.style.display = 'block');
        logoutLinks.forEach(link => link.style.display = 'none');
    }
}
// Check if user is logged in on protected pages
document.addEventListener('DOMContentLoaded', function() {
    const protectedPages = ['products.html', 'cart.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'login.html';
        }
    }
    
    // Update navigation based on login status
    updateNav();
    
    // Logout functionality
    const logoutLinks = document.querySelectorAll('#logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});

// Login form submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // In a real app, you would send this to your server
        //  check for  email/password
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        const username = email.split('@')[0]; // Using email prefix as username for demo
        
        // Show welcome alert
        alert(`Welcome back, ${username}!`);
        
        // Redirect to products page after 1 second
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1000);
    });
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = '/index.html';
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        setTimeout(() => {
            errorElement.textContent = '';
        }, 3000);
    }
}

// Update navigation based on login status
function updateNav() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginLinks = document.querySelectorAll('#login-link');
    const logoutLinks = document.querySelectorAll('#logout-link');
    
    if (isLoggedIn) {
        loginLinks.forEach(link => link.style.display = 'none');
        logoutLinks.forEach(link => link.style.display = 'block');
    } else {
        loginLinks.forEach(link => link.style.display = 'block');
        logoutLinks.forEach(link => link.style.display = 'none');
    }
}



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
    
    // Theme toggle event listeners
    themeToggle.addEventListener('change', toggleTheme);
    mobileThemeToggle.addEventListener('change', toggleTheme);
    
    function toggleTheme(e) {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            // Sync both toggles
            themeToggle.checked = true;
            mobileThemeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            // Sync both toggles
            themeToggle.checked = false;
            mobileThemeToggle.checked = false;
        }
    }
    
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



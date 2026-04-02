// auth.js - Fixed to use your backend database

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

// Login form submission - FIXED to use your backend
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        try {
            // Send request to your backend
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Only set localStorage if backend validates the user
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                const username = email.split('@')[0];
                alert(`Welcome back, ${username}!`);
                
                // Redirect to products page
                window.location.href = 'products.html';
            } else {
                // Show error message from backend
                showError(data.message || 'Invalid email or password');
                // Clear any existing login state
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
            }
        } catch (error) {
            console.error("Login error:", error);
            showError("Network error. Please check if server is running on port 5000");
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        setTimeout(() => {
            errorElement.textContent = '';
        }, 3000);
    } else {
        // Create error element if it doesn't exist
        const form = document.getElementById('login-form');
        if (form) {
            let error = document.getElementById('error-message');
            if (!error) {
                error = document.createElement('div');
                error.id = 'error-message';
                error.style.color = 'red';
                error.style.marginTop = '10px';
                form.appendChild(error);
            }
            error.textContent = message;
            setTimeout(() => {
                error.textContent = '';
            }, 3000);
        }
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
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuOverlay.style.display = 'flex';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenuOverlay.style.display = 'none';
        });
    }
    
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
        if (themeToggle) themeToggle.checked = true;
        if (mobileThemeToggle) mobileThemeToggle.checked = true;
    }
    
    // Theme toggle event listeners
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', toggleTheme);
    }
    
    function toggleTheme(e) {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            if (themeToggle) themeToggle.checked = true;
            if (mobileThemeToggle) mobileThemeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            if (themeToggle) themeToggle.checked = false;
            if (mobileThemeToggle) mobileThemeToggle.checked = false;
        }
    }
    
    // Mobile menu links functionality
    const mobileProductsLink = document.getElementById('mobile-products-link');
    if (mobileProductsLink) {
        mobileProductsLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!localStorage.getItem('isLoggedIn')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'products.html';
            }
        });
    }
    
    const mobileLoginLink = document.getElementById('mobile-login-link');
    if (mobileLoginLink) {
        mobileLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    
    const mobileCartLink = document.getElementById('mobile-cart-link');
    if (mobileCartLink) {
        mobileCartLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!localStorage.getItem('isLoggedIn')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'cart.html';
            }
        });
    }
    
    // Update cart count in mobile menu
    function updateMobileCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.querySelector('.mobile-cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    updateMobileCartCount();
});
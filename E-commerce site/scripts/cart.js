// cart.js - Updated with M-Pesa Integration

function formatCurrency(amount) {
    return 'KSh ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Store products data
const products = [
    { id: 1, name: 'Nike Air Max', price: 1200.00, image: '/images/imani-bahati-LxVxPA1LOVM-unsplash.jpg' },
    { id: 2, name: 'Nike', price: 1099.99, image: '/images/luis-felipe-lins-LG88A2XgIXY-unsplash (1).jpg' },
    { id: 3, name: 'Nike Air Pink', price: 1119.50, image: '/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg' },
    { id: 4, name: 'Highheels', price: 999.00, image: '/images/emily-pottiger-Zx76sbAndc0-unsplash.jpg'},
    { id: 5, name: 'Zara HighHeels', price: 2399.99, image: '/images/allyson-johnson-lY3d_sIzBXg-unsplash.jpg' },
    { id: 6, name: 'Nike Running', price: 3999.00, image: '/images/domino-studio-164_6wVEHfI-unsplash.jpg' }
];

document.addEventListener('DOMContentLoaded', function () {
    loadCartItems();
    updateCartTotals();
    setupCheckoutButton();
});

function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    const cartItemElement = createCartItemElement(product, cartItem);
                    cartItemsContainer.appendChild(cartItemElement);
                }
            });

            // Add event listeners
            attachCartEventListeners();
        }
    }
}

function createCartItemElement(product, cartItem) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="cart-item-details">
            <h3>${product.name}</h3>
            <p>${formatCurrency(product.price)}</p>
            <div class="quantity-controls">
                <button class="quantity-btn minus" data-id="${product.id}">-</button>
                <span class="quantity">${cartItem.quantity}</span>
                <button class="quantity-btn plus" data-id="${product.id}">+</button>
            </div>
        </div>
        <div class="cart-item-total">
            ${formatCurrency(product.price * cartItem.quantity)}
        </div>
        <button class="remove-btn" data-id="${product.id}">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return div;
}

function attachCartEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const isPlus = this.classList.contains('plus');
            updateCartItemQuantity(productId, isPlus);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

function updateCartItemQuantity(productId, isPlus) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        if (isPlus) {
            cart[itemIndex].quantity += 1;
        } else {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.reload();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.reload();
}

function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            subtotal += product.price * cartItem.quantity;
        }
    });

    const shipping = cart.length > 0 ? 350.00 : 0.00;
    const total = subtotal + shipping;

    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    }
    if (document.getElementById('shipping')) {
        document.getElementById('shipping').textContent = formatCurrency(shipping);
    }
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = formatCurrency(total);
    }

    // Update cart count in nav
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElem = document.querySelector('.cart-count');
    if (cartCountElem) {
        cartCountElem.textContent = totalItems;
    }
}

function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Check if user is logged in
            if (!localStorage.getItem('isLoggedIn')) {
                alert('Please login to checkout');
                window.location.href = 'login.html';
                return;
            }
            
            // Show M-Pesa payment modal
            showMpesaModal();
        });
    }
}

// M-Pesa Payment Functions
function showMpesaModal() {
    const modal = document.getElementById('mpesaModal');
    const totalSpan = document.getElementById('modalTotal');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate total
    let subtotal = 0;
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            subtotal += product.price * cartItem.quantity;
        }
    });
    const total = subtotal + 350.00;
    
    if (totalSpan) {
        totalSpan.textContent = formatCurrency(total);
    }
    
    if (modal) {
        modal.style.display = 'flex';
        setupModalEventListeners();
    }
}

function setupModalEventListeners() {
    const modal = document.getElementById('mpesaModal');
    const closeBtn = document.querySelector('.close-modal');
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    const phoneInput = document.getElementById('phoneNumber');
    
    // Remove old listeners to avoid duplicates
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    if (confirmBtn) {
        confirmBtn.onclick = async () => {
            const phoneNumber = phoneInput ? phoneInput.value.trim() : '';
            
            if (!phoneNumber) {
                showPaymentStatus('Please enter your phone number', 'error');
                return;
            }
            
            // Format phone number (remove 0 or + if present)
            let formattedPhone = phoneNumber;
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '254' + formattedPhone.substring(1);
            } else if (formattedPhone.startsWith('+')) {
                formattedPhone = formattedPhone.substring(1);
            }
            
            if (formattedPhone.length !== 12 || !formattedPhone.startsWith('254')) {
                showPaymentStatus('Please enter a valid phone number (e.g., 254712345678)', 'error');
                return;
            }
            
            // Calculate total amount
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            let subtotal = 0;
            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    subtotal += product.price * cartItem.quantity;
                }
            });
            const amount = subtotal + 350.00;
            
            // Disable button and show loading
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Processing...';
            showPaymentStatus('Initiating payment... Please wait', 'info');
            
            try {
                // Send request to your backend
                const response = await fetch('http://localhost:5000/api/mpesa/stkpush', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: formattedPhone,
                        amount: Math.round(amount) // M-Pesa accepts whole numbers
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data.ResponseCode === '0') {
                    showPaymentStatus(
                        'STK Push sent! Please check your phone and enter your M-Pesa PIN to complete payment.',
                        'success'
                    );
                    
                    // Store transaction info for verification
                    localStorage.setItem('pendingTransaction', JSON.stringify({
                        checkoutRequestID: data.CheckoutRequestID,
                        amount: amount,
                        timestamp: new Date().toISOString()
                    }));
                    
                    // Start polling for payment status
                    pollPaymentStatus(data.CheckoutRequestID);
                } else {
                    showPaymentStatus(data.ResponseDescription || 'Payment initiation failed', 'error');
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'Confirm & Pay';
                }
            } catch (error) {
                console.error('Payment error:', error);
                showPaymentStatus('Network error. Please try again.', 'error');
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirm & Pay';
            }
        };
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function showPaymentStatus(message, type) {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = message;
        statusDiv.className = `payment-status ${type}`;
        statusDiv.style.padding = '10px';
        statusDiv.style.marginTop = '15px';
        statusDiv.style.borderRadius = '5px';
        
        if (type === 'success') {
            statusDiv.style.backgroundColor = '#d4edda';
            statusDiv.style.color = '#155724';
        } else if (type === 'error') {
            statusDiv.style.backgroundColor = '#f8d7da';
            statusDiv.style.color = '#721c24';
        } else {
            statusDiv.style.backgroundColor = '#d1ecf1';
            statusDiv.style.color = '#0c5460';
        }
    }
}

function pollPaymentStatus(checkoutRequestID) {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 60 seconds (2 second intervals)
    
    const interval = setInterval(async () => {
        attempts++;
        
        try {
            const response = await fetch('http://localhost:5000/api/mpesa/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    checkoutRequestID: checkoutRequestID
                })
            });
            
            const data = await response.json();
            
            if (data.ResultCode === '0') {
                // Payment successful
                clearInterval(interval);
                showPaymentStatus('Payment successful! Redirecting...', 'success');
                
                // Clear cart
                localStorage.removeItem('cart');
                localStorage.removeItem('pendingTransaction');
                
                // Redirect to success page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'order-success.html';
                }, 2000);
            } else if (data.ResultCode && data.ResultCode !== '0') {
                // Payment failed
                clearInterval(interval);
                showPaymentStatus(`Payment failed: ${data.ResultDesc || 'Unknown error'}`, 'error');
                
                // Re-enable confirm button
                const confirmBtn = document.getElementById('confirmPaymentBtn');
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'Confirm & Pay';
                }
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
        
        // Stop polling after max attempts
        if (attempts >= maxAttempts) {
            clearInterval(interval);
            const confirmBtn = document.getElementById('confirmPaymentBtn');
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirm & Pay';
            }
            showPaymentStatus('Payment confirmation timeout. Please check your M-Pesa messages.', 'info');
        }
    }, 2000);
}
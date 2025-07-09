function formatCurrency(product) {
    return 'KSh ' + product.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

document.addEventListener('DOMContentLoaded', function () {
    const products = [
        { id: 1, name: 'Nike Air Max', price: 1200.00, image: '/images/imani-bahati-LxVxPA1LOVM-unsplash.jpg' },
        { id: 2, name: 'Nike', price: 1099.99, image: '/images/luis-felipe-lins-LG88A2XgIXY-unsplash (1).jpg' },
        { id: 3, name: 'Nike Air Pink', price: 1119.50, image: '/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg' },
        { id: 4, name: 'Highheels', price: 999.00, image: '/images/emily-pottiger-Zx76sbAndc0-unsplash.jpg'},
        { id: 5, name: 'Zara HighHeels', price: 2399.99, image: '/images/allyson-johnson-lY3d_sIzBXg-unsplash.jpg' },
        { id: 6, name: 'Nike Running', price: 3999.00, image: '/images/domino-studio-164_6wVEHfI-unsplash.jpg' }
    ];

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
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';

                    cartItemElement.innerHTML = `
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

                    cartItemsContainer.appendChild(cartItemElement);
                }
            });

            // Add event listeners for quantity controls
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const isPlus = this.classList.contains('plus');
                    updateCartItemQuantity(productId, isPlus);
                });
            });

            // Add event listeners for remove buttons
            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(productId);
                });
            });
        }
    }

    // Calculate and display totals
    updateCartTotals();

    // Proceed to checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                alert('Checkout successful!');
                //  should redirect to a checkout page.
            }
        });
    }
});

// Update cart item quantity
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
                // If quantity would be 0, remove the item
                cart.splice(itemIndex, 1);
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.reload(); // Refresh to show updated cart
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.reload(); // Refresh to show updated cart
}

// Update cart totals
function updateCartTotals() {
    // Use the same prices as in the product list above for consistency
    const products = [
        { id: 1, price: 1200.00 },
        { id: 2, price: 1099.99 },
        { id: 3, price: 1119.50 },
        { id: 4, price: 999.00 },
        { id: 5, price: 2399.99 },
        { id: 6, price: 3999.00 }
    ];

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            subtotal += product.price * cartItem.quantity;
        }
    });

    const shipping = cart.length > 0 ? 5.00 : 0.00;
    const total = subtotal + shipping;

    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `${formatCurrency(subtotal)}`;
    }
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = `${formatCurrency(total)}`;
    }

    // Also update cart count in nav
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElem = document.querySelector('.cart-count');
    if (cartCountElem) {
        cartCountElem.textContent = totalItems;
    }
}
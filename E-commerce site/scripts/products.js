function formatCurrency(products) {
    return 'KSh ' + products.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: 'Nike Air Max',
            price: 1200.00,
            image: '/images/imani-bahati-LxVxPA1LOVM-unsplash.jpg',
            rating: 4.5,
            category: 'sneakers'
        },
        {
            id: 2,
            name: 'Nike',
            price: 1099.99,
            image: '/images/luis-felipe-lins-LG88A2XgIXY-unsplash (1).jpg',
            rating: 4.2,
            category: 'sneakers'
        },
        {
            id: 3,
            name: 'Nike Air Pink',
            price: 1119.50,
            image: '/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg',
            rating: 4.0,
            category: 'sneakers'
        },
        {
            id: 4,
            name: 'Highheels',
            price: 999.00,
            image: '/images/emily-pottiger-Zx76sbAndc0-unsplash.jpg',
            rating: 4.7,
            category: 'formal'
        },
        {
            id: 5,
            name: 'Zara HighHeels',
            price: 2399.99,
            image: '/images/allyson-johnson-lY3d_sIzBXg-unsplash.jpg',
            rating: 4.8,
            category: 'formal'
        },
        {
            id: 6,
            name: 'Nike Running',
            price: 3999.00,
            image: '/images/domino-studio-164_6wVEHfI-unsplash.jpg',
            rating: 4.3,
            category: 'sports'
        }
    ];

    // Display products
    const productsGrid = document.querySelector('.products-grid');
    
    if (productsGrid) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    <div class="product-rating">
                        ${getRatingStars(product.rating)}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
});

// Generate rating stars
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add product to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    alert('Product added to cart!');
}

// Update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Initialize cart count on page load
updateCartCount();
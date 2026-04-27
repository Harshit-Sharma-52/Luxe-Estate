// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

menuToggle.addEventListener('click', function() {
    nav.classList.toggle('active');
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Filter Buttons
const filterBtns = document.querySelectorAll('.filter-btn');
const propertyCards = document.querySelectorAll('.property-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        propertyCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category.includes(filterValue)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        nav.classList.remove('active');
    });
});

// Wishlist (Heart) Button
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('i');
        const card = this.closest('.property-card');
        const title = card ? card.querySelector('.property-title').textContent : 'Property';
        
        if (icon.classList.contains('fa-heart')) {
            if (icon.classList.contains('fas')) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Removed from wishlist!', 'removed');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Added to wishlist: ' + title, 'success');
                saveToWishlist(card);
            }
        }
    });
});

// Share Button
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.preventDefault();
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('fa-share')) {
            const card = this.closest('.property-card');
            const title = card ? card.querySelector('.property-title').textContent : 'Property';
            const price = card ? card.querySelector('.property-price').textContent : '';
            
            const shareData = {
                title: title + ' - LuxeEstate',
                text: 'Check out this property: ' + title + ' for ' + price,
                url: window.location.href
            };
            
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log('Share cancelled');
                }
            } else {
                const text = 'Check out this property: ' + title + ' for ' + price + ' - ' + window.location.href;
                copyToClipboard(text);
            }
        }
    });
});

// Maximize/Expand Button
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('fa-expand')) {
            const card = this.closest('.property-card');
            const title = card ? card.querySelector('.property-title').textContent : 'Property';
            const price = card ? card.querySelector('.property-price').textContent : '';
            const address = card ? card.querySelector('.property-address').textContent : '';
            
            openPropertyModal(card);
        }
    });
});

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'removed' ? 'times-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Save to localStorage wishlist
function saveToWishlist(card) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const title = card.querySelector('.property-title').textContent;
    const price = card.querySelector('.property-price').textContent;
    const img = card.querySelector('.card-image img').src;
    
    const property = { title, price, img, date: new Date().toISOString() };
    wishlist.push(property);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Open Property Modal
function openPropertyModal(card) {
    const title = card.querySelector('.property-title').textContent;
    const price = card.querySelector('.property-price').textContent;
    const address = card.querySelector('.property-address').textContent;
    const img = card.querySelector('.card-image img').src;
    const features = [];
    card.querySelectorAll('.property-features .feature span').forEach(f => features.push(f.textContent));
    
    const modal = document.createElement('div');
    modal.className = 'property-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-image">
                <img src="${img}" alt="${title}">
            </div>
            <div class="modal-details">
                <h2>${title}</h2>
                <p class="modal-price">${price}</p>
                <p class="modal-address"><i class="fas fa-map-marker-alt"></i> ${address}</p>
                <div class="modal-features">
                    ${features.map(f => `<span><i class="fas fa-check"></i> ${f}</span>`).join('')}
                </div>
                <div class="modal-actions">
                    <a href="tel:+15551234567" class="modal-btn call"><i class="fas fa-phone"></i> Call</a>
                    <a href="https://wa.me/15551234567" class="modal-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                    <a href="contact.html" class="modal-btn contact"><i class="fas fa-envelope"></i> Contact</a>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Form Submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        this.reset();
    });
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('input');
        if (input.value) {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            input.value = '';
        }
    });
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .notification.show {
        transform: translateX(0);
    }
    .notification.removed {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
    }
    .notification.error {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
    }
    
    .property-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    .modal-content {
        background: #1a1a2e;
        border-radius: 20px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }
    .modal-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: rgba(0,0,0,0.5);
        border: none;
        color: white;
        font-size: 2rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;
    }
    .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
    .modal-details {
        padding: 30px;
    }
    .modal-details h2 {
        margin-bottom: 10px;
    }
    .modal-price {
        font-size: 2rem;
        font-weight: 700;
        color: #3498db;
        margin-bottom: 15px;
    }
    .modal-address {
        color: #949494;
        margin-bottom: 20px;
    }
    .modal-features {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 25px;
    }
    .modal-features span {
        background: rgba(52, 152, 219, 0.2);
        padding: 10px 20px;
        border-radius: 20px;
        color: #3498db;
    }
    .modal-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    .modal-btn {
        padding: 12px 25px;
        border-radius: 25px;
        text-decoration: none;
        color: white;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: transform 0.3s;
    }
    .modal-btn:hover {
        transform: translateY(-3px);
    }
    .modal-btn.call { background: #e74c3c; }
    .modal-btn.whatsapp { background: #25D366; }
    .modal-btn.contact { background: #3498db; }
`;
document.head.appendChild(notificationStyles);

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    const hero = document.querySelector('#home');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Navbar indicator hover effect
const headerNavLinks = document.querySelectorAll('header nav a');

headerNavLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        headerNavLinks.forEach(l => {
            l.style.background = 'transparent';
        });
        this.style.background = 'rgba(52, 152, 219, 0.2)';
        this.style.borderRadius = '25px';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
    });
});

// Initialize - load wishlist icons state
document.addEventListener('DOMContentLoaded', function() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const cards = document.querySelectorAll('.property-card');
    
    cards.forEach(card => {
        const title = card.querySelector('.property-title').textContent;
        const isInWishlist = wishlist.some(item => item.title === title);
        
        if (isInWishlist) {
            const heartBtn = card.querySelector('.action-btn .fa-heart');
            if (heartBtn) {
                heartBtn.classList.remove('far');
                heartBtn.classList.add('fas');
            }
        }
    });
});
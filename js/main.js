/* ============================================
   ZAVE DIGITAL — Main JavaScript
   ============================================ */
'use strict';

// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// === MOBILE MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
    });
});

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === INTERSECTION OBSERVER — Fade In ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

try {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply fade-in to cards
    document.querySelectorAll('.service-card, .why-item, .contact-item, .about-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
} catch (e) {
    // IntersectionObserver not supported — show all cards
    document.querySelectorAll('.service-card, .why-item, .contact-item, .about-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// === CONTACT FORM — WhatsApp Redirect ===
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        try {
            const name    = encodeURIComponent(document.getElementById('name')?.value || '');
            const email   = encodeURIComponent(document.getElementById('email')?.value || '');
            const phone   = encodeURIComponent(document.getElementById('phone')?.value || '');
            const service = encodeURIComponent(document.getElementById('service')?.value || '');
            const message = encodeURIComponent(document.getElementById('message')?.value || '');
            
            const whatsappMsg = `*New Lead from Zave Digital Website*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Message:* ${message}`;
            
            window.open(`https://wa.me/923194051964?text=${whatsappMsg}`, '_blank');
        } catch (err) {
            // Fallback: open WhatsApp with simple message
            window.open('https://wa.me/923194051964?text=Hi%20Zave!%20I%27m%20interested%20in%20your%20services.', '_blank');
        }
    });
}

// === ACTIVE NAV LINK ===
try {
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
} catch (e) {
    // Silent fail
}

// === SERVICE FILTER ===
try {
    const serviceFilterBtns = document.querySelectorAll('.category-filter .filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (serviceFilterBtns.length > 0 && serviceCards.length > 0) {
        serviceFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                serviceFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                serviceCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = '';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        const category = card.getAttribute('data-category');
                        if (category === filter) {
                            card.style.display = '';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        } else {
                            card.style.display = 'none';
                            card.style.opacity = '0';
                        }
                    }
                });
            });
        });
    }
} catch (e) {
    // Silent fail — filter won't work but page still functional
}

// === PORTFOLIO FILTER TABS ===
try {
    const portfolioFilterBtns = document.querySelectorAll('.portfolio-filters .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (portfolioFilterBtns.length > 0 && portfolioItems.length > 0) {
        portfolioFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                portfolioFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = '';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        const category = item.getAttribute('data-category');
                        if (category === filter) {
                            item.style.display = '';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        } else {
                            item.style.display = 'none';
                            item.style.opacity = '0';
                        }
                    }
                });
            });
        });
    }
} catch (e) {
    // Silent fail
}

// === GALLERY NAV — Active state on scroll ===
try {
    const gallerySections = document.querySelectorAll('.gallery-section[id]');
    const galleryNavLinks = document.querySelectorAll('.gallery-nav a');

    if (gallerySections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            gallerySections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            galleryNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }
} catch (e) {
    // Silent fail
}

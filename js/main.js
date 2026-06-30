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

// === SERVICE CARD CLICK → WHATSAPP DIRECT INQUIRY ===
try {
    serviceCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.setAttribute('title', 'Click karke WhatsApp par direct inquiry karo');
        
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking actual buttons/links
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            const serviceName = card.querySelector('h3')?.textContent?.trim() || 'Unknown Service';
            const category = card.getAttribute('data-category') || '';
            const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
            
            const message = encodeURIComponent(`Hello Zave Digital! I'm interested in:\n\nService: ${serviceName}\nCategory: ${categoryLabel}\n\nPlease share details & pricing.`);
            window.open(`https://wa.me/923194051964?text=${message}`, '_blank');
        });
    });
} catch (e) {
    // Silent fail
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

// === BLOG CARD EXPAND ===
try {
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't expand if clicking a button/link
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            card.classList.toggle('expanded');
        });
    });
} catch (e) {
    // Silent fail
}

// === CONTACT FORM SECURITY + SUBMISSION ===
try {
    const form = document.getElementById('contactForm');
    if (form) {
        // CSRF token generation & validation
        const csrfInput = document.getElementById('csrfToken');
        if (csrfInput && !csrfInput.value) {
            let token = sessionStorage.getItem('zave_csrf_token');
            if (!token) {
                token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                sessionStorage.setItem('zave_csrf_token', token);
            }
            csrfInput.value = token;
        }

        // Intercept form submit — send via WhatsApp to prevent GET leakage
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // CSRF check
            const submittedToken = csrfInput ? csrfInput.value : '';
            const storedToken = sessionStorage.getItem('zave_csrf_token');
            if (!submittedToken || submittedToken !== storedToken) {
                alert('Security validation failed. Please refresh the page.');
                return false;
            }

            // Collect form data
            const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
            const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
            const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
            const service = document.getElementById('service') ? document.getElementById('service').value : '';
            const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';

            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, Message).');
                return false;
            }

            // Build WhatsApp message
            const waNumber = '923194051964';
            let waMsg = `New Inquiry from Zave Digital Website\n\n`;
            waMsg += `Name: ${name}\n`;
            waMsg += `Email: ${email}\n`;
            if (phone) waMsg += `Phone: ${phone}\n`;
            if (service) waMsg += `Service: ${service}\n`;
            waMsg += `Message: ${message}\n`;
            waMsg += `\n[CSRF: ${submittedToken.slice(0, 8)}...]`;

            const encoded = encodeURIComponent(waMsg);
            window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');

            // Success feedback
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                btn.style.background = '#00b894';
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    form.reset();
                    if (csrfInput) {
                        const newToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
                            .map(b => b.toString(16).padStart(2, '0'))
                            .join('');
                        sessionStorage.setItem('zave_csrf_token', newToken);
                        csrfInput.value = newToken;
                    }
                }, 2500);
            }

            return false;
        });
    }
} catch (e) {
    // Silent fail — form will fall back to default behavior
}

// === LANGUAGE SYSTEM ===
try {
    const translations = {
        'en': {
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.testimonials': 'Testimonials',
            'nav.portfolio': 'Portfolio',
            'nav.about': 'About',
            'nav.contact': 'Contact',
            'nav.getQuote': 'Get Quote',
        },
        'roman-urdu': {
            'nav.home': 'Ghar',
            'nav.services': 'Himayat',
            'nav.testimonials': 'Rae',
            'nav.portfolio': 'Khidmat',
            'nav.about': 'Hamari Baat',
            'nav.contact': 'Rabet',
            'nav.getQuote': 'Sawaal',
        },
        'urdu': {
            'nav.home': 'گھر',
            'nav.services': 'خدمات',
            'nav.testimonials': 'رائے',
            'nav.portfolio': 'پورٹ فولیو',
            'nav.about': 'ہمارے بارے',
            'nav.contact': 'رابطہ',
            'nav.getQuote': 'استفسار',
        },
        'punjabi': {
            'nav.home': 'ਘਰ',
            'nav.services': 'ਸੇਵਾਵਾਂ',
            'nav.testimonials': 'ਰਾਏ',
            'nav.portfolio': 'ਪੋਰਟਫੋਲਿਓ',
            'nav.about': 'ਸਾਡੇ ਬਾਰੇ',
            'nav.contact': 'ਸੰਪਰਕ',
            'nav.getQuote': 'ਪੁੱਛਣਾ',
        }
    };

    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.parentElement.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            langDropdown.parentElement.classList.remove('open');
        });

        document.querySelectorAll('#langDropdown li').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.getAttribute('data-lang');
                const langData = translations[lang];
                if (!langData) return;

                document.documentElement.lang = lang;
                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const key = el.getAttribute('data-i18n');
                    if (langData[key]) {
                        el.textContent = langData[key];
                    }
                });

                const labels = {
                    'en': 'EN',
                    'roman-urdu': 'RU',
                    'urdu': 'UR',
                    'punjabi': 'PA'
                };
                langBtn.innerHTML = `<i class="fas fa-globe"></i> ${labels[lang] || 'EN'}`;
                langDropdown.parentElement.classList.remove('open');
            });
        });
    }
} catch (e) {
    // Silent fail — language switcher won't work but page functional
}

// === AI ASSISTANT ===
try {
    const aiKnowledge = {
        'website': 'Zave Digital professional responsive websites banata hai. Starting price Rs. 5,000. Aap WhatsApp par +92 319 4051964 par detail le sakte ho.',
        'mobile repair': 'Mobile repair services: FRP unlock Rs. 1,500, Pattern unlock Rs. 1,000, Flashing Rs. 2,000, Bootloop fix Rs. 1,500, WiFi/Network fix Rs. 1,000.',
        'social media': 'Social media management Facebook aur Instagram ke liye. Monthly packages available. Detail ke liye contact karein.',
        'google my business': 'Google My Business setup sirf Rs. 3,000 mein. Local search ranking improve hota hai.',
        'seo': 'SEO services websites ko Google par rank lane ke liye. Packages ke liye contact karein.',
        'pos': 'POS system aur Payment Gateway integration (JazzCash, EasyPaisa, Card) available hai.',
        'restaurant': 'Restaurant digital ordering system menu + orders WhatsApp par. Starting Rs. 8,000.',
        'school': 'School/Clinic management apps banate hain. Starting Rs. 15,000.',
        'default': 'Main aapki service, price, aur booking mein madad kar sakta hoon. Aap apna sawal type karein ya mic par click karke bol dein. Zaroorat ho to direct WhatsApp: +92 319 4051964'
    };

    const getAIResponse = (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('website') || lower.includes('web') || lower.includes('site') || lower.includes('sait'))
            return aiKnowledge['website'];
        if (lower.includes('mobile') || lower.includes('phone') || lower.includes('frp') || lower.includes('unlock') || lower.includes('flash'))
            return aiKnowledge['mobile repair'];
        if (lower.includes('social') || lower.includes('facebook') || lower.includes('instagram'))
            return aiKnowledge['social media'];
        if (lower.includes('google') || lower.includes('gmb') || lower.includes('map') || lower.includes('business listing'))
            return aiKnowledge['google my business'];
        if (lower.includes('seo') || lower.includes('rank') || lower.includes('search'))
            return aiKnowledge['seo'];
        if (lower.includes('pos') || lower.includes('payment') || lower.includes('jazzcash') || lower.includes('easypaisa'))
            return aiKnowledge['pos'];
        if (lower.includes('restaurant') || lower.includes('hotel') || lower.includes('cafe') || lower.includes('menu'))
            return aiKnowledge['restaurant'];
        if (lower.includes('school') || lower.includes('clinic') || lower.includes('hospital') || lower.includes('academy'))
            return aiKnowledge['school'];
        if (lower.includes('price') || lower.includes('paisa') || lower.includes('cost') || lower.includes('kitna') || lower.includes('fees'))
            return 'Prices service ke mutabiq different hain. Aap kis service ka price chahte ho? Type karein: Website, Mobile Repair, SEO, Social Media, GMB, POS, Restaurant, School/Clinic.';
        if (lower.includes('assalam') || lower.includes('salam') || lower.includes('hello') || lower.includes('hi') || lower.includes('hlo'))
            return 'Assalamualaikum! Aapka swagat hai. Main Zave AI hoon — aap kuch bhi pooch sakte ho service ya price ke baray mein.';
        return aiKnowledge['default'];
    };

    const aiLauncher = document.getElementById('aiLauncher');
    const aiChat = document.getElementById('aiChat');
    const aiClose = document.getElementById('aiClose');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    const aiMic = document.getElementById('aiMic');
    const aiMessages = document.getElementById('aiMessages');

    const appendMessage = (text, sender) => {
        const div = document.createElement('div');
        div.className = `ai-msg ai-msg-${sender}`;
        div.innerHTML = text;
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    };

    if (aiLauncher && aiChat) {
        aiLauncher.addEventListener('click', () => {
            const open = !aiChat.classList.contains('open');
            if (open) {
                aiChat.classList.add('open');
                aiChat.style.display = 'flex';
            } else {
                aiChat.classList.remove('open');
                aiChat.style.display = 'none';
            }
        });
    }

    if (aiClose) {
        aiClose.addEventListener('click', () => {
            aiChat.classList.remove('open');
            aiChat.style.display = 'none';
        });
    }

    const handleSend = (text) => {
        const msg = (text || '').trim();
        if (!msg) return;
        appendMessage(msg, 'user');
        const reply = getAIResponse(msg);
        setTimeout(() => appendMessage(reply, 'bot'), 400 + Math.random() * 600);
        if (aiInput) aiInput.value = '';
    };

    if (aiSend && aiInput) {
        aiSend.addEventListener('click', () => handleSend(aiInput.value));
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSend(aiInput.value);
        });
    }

    document.querySelectorAll('.ai-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => handleSend(btn.getAttribute('data-msg')));
    });

    if (aiMic) {
        aiMic.addEventListener('click', () => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                alert('Voice input is not supported in this browser. Please type your message.');
                return;
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-PK';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            aiMic.style.background = '#00b894';
            recognition.start();
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleSend(transcript);
            };
            recognition.onspeechend = () => recognition.stop();
            recognition.onerror = () => { aiMic.style.background = ''; };
            recognition.onend = () => { aiMic.style.background = ''; };
        });
    }
} catch (e) {
    // Silent fail — AI assistant won't load but page functional
}

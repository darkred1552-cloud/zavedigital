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

/* ============================================
   AI ASSISTANT — Smart Chatbot Logic
   ============================================ */
(function() {
    'use strict';
    console.log('AI Assistant JS loaded');

    const launcher = document.getElementById('aiLauncher');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiClose');
    const sendBtn = document.getElementById('aiSend');
    const input = document.getElementById('aiInput');
    const messagesContainer = document.getElementById('aiMessages');
    const quickBtns = document.querySelectorAll('.ai-quick-btn');

    console.log('AI elements:', {launcher: !!launcher, chat: !!chatWindow, close: !!closeBtn, send: !!sendBtn, input: !!input, messages: !!messagesContainer, btns: quickBtns.length});

    if (!launcher || !chatWindow) {
        console.error('AI Assistant: critical elements missing');
        return;
    }

    let isOpen = false;

    function toggleChat() {
        console.log('toggleChat called, isOpen:', isOpen);
        isOpen = !isOpen;
        chatWindow.classList.toggle('active', isOpen);
        if (isOpen) {
            setTimeout(() => input.focus(), 350);
        }
    }

    function addMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${isUser ? 'ai-user' : 'ai-bot'}`;
        msgDiv.innerHTML = `
            <div class="ai-msg-avatar"><i class="fas fa-${isUser ? 'user' : 'robot'}"></i></div>
            <div class="ai-msg-content">${text}</div>
        `;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getSmartReply(msg) {
        const lower = msg.toLowerCase();

        // Urdu keywords
        const urduKeywords = {
            'website': 'website',
            'ویب سائٹ': 'website',
            'social media': 'social',
            'سمارٹ فون': 'mobile',
            'mobile repair': 'mobile',
            'موبائل': 'mobile',
            'frp': 'mobile',
            ' unlocked': 'mobile',
            'gmb': 'gmb',
            'google my business': 'gmb',
            'گوگل بزنس': 'gmb',
            'pos': 'pos',
            'peyment': 'pos',
            'QR code': 'pos',
            'price': 'price',
            'قیمت': 'price',
            'kitna': 'price',
            'contract': 'contact',
            'whatsapp': 'whatsapp',
            'واٹس ایپ': 'whatsapp',
            'call': 'contact',
            'number': 'contact',
            'help': 'help',
            'madad': 'help',
            'seo': 'seo',
            'rank': 'seo',
            'ads': 'ads',
            'ایڈز': 'ads'
        };

        let category = 'general';
        for (const [key, val] of Object.entries(urduKeywords)) {
            if (lower.includes(key)) {
                category = val;
                break;
            }
        }

        // Smart replies
        const replies = {
            'website': `
                <p><strong>🌐 Website Development</strong></p>
                <p>Ham 5-page responsive website banate hain:</p>
                <p>✅ Modern Design + SSL<br>✅ FREE Domain + Hosting<br>✅ WhatsApp Integration<br>✅ SEO Setup</p>
                <p><strong>Offer:</strong> First website <strong>50% OFF</strong> — Rs. 15,000 (was Rs. 30,000)</p>
                <a href="https://wa.me/923194051964?text=Hello!%20I%20need%20a%20website.%20Please%20share%20details." class="ai-whatsapp-btn" target="_blank">📞 WhatsApp Order</a>
            `,
            'mobile': `
                <p><strong>📱 Mobile Repair Services</strong></p>
                <p>Software-only solutions (no parts):</p>
                <p>✅ Mobile Detect + Password Remove — Rs. 1,000<br>✅ FRP Unlock — Rs. 1,500<br>✅ Bootloop Fix — Rs. 1,500<br>✅ Data Recovery — Rs. 2,500</p>
                <p><strong>Combo Pack:</strong> Rs. 3,500 (was Rs. 6,000)</p>
                <a href="https://wa.me/923194051964?text=Hello!%20I%20need%20mobile%20repair%20service.%20Please%20share%20details." class="ai-whatsapp-btn" target="_blank">📞 Book Mobile Repair</a>
            `,
            'social': `
                <p><strong>📢 Social Media Management</strong></p>
                <p>Ham manage karte hain:</p>
                <p>✅ Facebook + Instagram + TikTok<br>✅ 12 Custom Posts/Month<br>✅ 4 Reels/Shorts (Script + Edit)<br>✅ Weekly Report</p>
                <p><strong>Price:</strong> Rs. 7,500/month (was Rs. 12,000)</p>
                <a href="https://wa.me/923194051964?text=Hi!%20I%20need%20Social%20Media%20Management.%20Tell%20me%20more." class="ai-whatsapp-btn" target="_blank">📞 Get Started</a>
            `,
            'gmb': `
                <p><strong>📍 Google My Business Pro</strong></p>
                <p>Local business ke liye essential:</p>
                <p>✅ GMB Setup + Verification<br>✅ 100% Ranking Optimization<br>✅ 50 Organic Reviews<br>✅ Maps + Photos Optimization</p>
                <p><strong>Price:</strong> Rs. 4,500 (was Rs. 8,000)</p>
                <a href="https://wa.me/923194051964?text=Hello!%20I%20want%20Google%20My%20Business%20Setup.%20Share%20details." class="ai-whatsapp-btn" target="_blank">📞 Order GMB</a>
            `,
            'pos': `
                <p><strong>💳 POS + Payment System</strong></p>
                <p>Complete billing solution:</p>
                <p>✅ JazzCash/EasyPaisa Integration<br>✅ QR Code Menu<br>✅ Inventory Management<br>✅ Sales Dashboard</p>
                <p><strong>Price:</strong> Rs. 12,000 (was Rs. 20,000)</p>
                <a href="https://wa.me/923194051964?text=Hi!%20I%20need%20POS%20System.%20Tell%20me%20more." class="ai-whatsapp-btn" target="_blank">📞 Get POS Demo</a>
            `,
            'price': `
                <p><strong>💰 Our Best Deals</strong></p>
                <p>🔹 Website — Rs. 15,000 (50% OFF)<br>🔹 Mobile Repair — Rs. 3,500<br>🔹 Social Media — Rs. 7,500/mo<br>🔹 GMB Setup — Rs. 4,500<br>🔹 POS System — Rs. 12,000</p>
                <a href="https://wa.me/923194051964?text=Hello!%20I%20want%20to%20know%20about%20your%20pricing%20and%20packages." class="ai-whatsapp-btn" target="_blank">📞 Get Custom Quote</a>
            `,
            'whatsapp': `
                <p><strong>📞 Direct WhatsApp</strong></p>
                <p>Ham se direct baat karo:</p>
                <p>+92 319 4051964</p>
                <a href="https://wa.me/923194051964?text=Hello%20Zave%20Digital!%20I%20need%20help%20with%20my%20business." class="ai-whatsapp-btn" target="_blank">💬 Open WhatsApp</a>
            `,
            'seo': `
                <p><strong>🚀 SEO & Google Ranking</strong></p>
                <p>Apne business ko Google par top par lao:</p>
                <p>✅ Website SEO Audit<br>✅ Keyword Research<br>✅ On-page + Off-page SEO<br>✅ Monthly Ranking Report</p>
                <a href="https://wa.me/923194051964?text=Hi!%20I%20need%20SEO%20services.%20Please%20share%20details." class="ai-whatsapp-btn" target="_blank">📞 Get SEO Plan</a>
            `,
            'ads': `
                <p><strong>📢 Facebook & Instagram Ads</strong></p>
                <p>Targeted ads jo real customers laate hain:</p>
                <p>✅ Ad Copywriting<br>✅ Audience Targeting<br>✅ Budget Optimization<br>✅ DailyMonitoring + Report</p>
                <a href="https://wa.me/923194051964?text=Hello!%20I%20need%20Facebook%20Ads%20management.%20Tell%20me%20more." class="ai-whatsapp-btn" target="_blank">📞 Boost My Sales</a>
            `,
            'help': `
                <p><strong>👋 Hi! Main Zave AI hoon</strong></p>
                <p>Main ye sab kar sakta hoon:</p>
                <p>• Service suggest karna<br>• Price batana<br>• Website/SEO help<br>• WhatsApp par connect karna</p>
                <p>Niche buttons use karo ya apna sawal type karo!</p>
            `
        };

        if (replies[category]) {
            return replies[category];
        }

        // Default reply
        return `
            <p><strong>🙂 Thanks for your message!</strong></p>
            <p>Main samajh gaya. Zave Digital mein ham ye services provide karte hain:</p>
            <p>🌐 Website Development<br>📱 Mobile Repair<br>📢 Social Media<br>📍 GMB Setup<br>💳 POS System</p>
            <p>Koi specific service chahiye? Ya direct WhatsApp par baat karo:</p>
            <a href="https://wa.me/923194051964?text=Hello%20Zave%20Digital!%20I%20need%20help.%20Please%20share%20details." class="ai-whatsapp-btn" target="_blank">📞 WhatsApp Us</a>
        `;
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, true);
        input.value = '';

        // Simulate typing delay
        setTimeout(() => {
            const reply = getSmartReply(text);
            addMessage(reply, false);
        }, 600 + Math.random() * 400);
    }

    // Event listeners
    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            input.value = msg;
            sendMessage();
        });
    });

    // Auto-open after 8 seconds for first-time visitors
    setTimeout(() => {
        if (!isOpen && !sessionStorage.getItem('aiChatOpened')) {
            chatWindow.classList.add('active');
            isOpen = true;
            sessionStorage.setItem('aiChatOpened', 'true');
        }
    }, 8000);

})();

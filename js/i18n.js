/* ============================================
   ZAVE DIGITAL — Multi-Language Switcher
   Languages: English / Roman Urdu / Urdu / Punjabi
   ============================================ */
(function () {
    'use strict';

    var translations = {
        en: {
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.testimonials': 'Testimonials',
            'nav.portfolio': 'Portfolio',
            'nav.order': 'Order',
            'nav.patients': 'Zave for Patients',

            'order.title': 'Apna Order Do',
            'order.subtitle': 'Services chuno, apna detail bharo, submit karo. Hum WhatsApp par confirm karenge.',
            'order.step1': '1. Services Chuno',
            'order.step1d': 'Ik ya zyada services chuno',
            'order.step2': '2. Details Bharo',
            'order.step2d': 'Naam, phone, requirements',
            'order.step3': '3. Order Bhejo',
            'order.step3d': 'Hum WhatsApp te contact karenge',
            'order.select': 'Services Chuno',
            'order.selectAll': 'Sab Select Karo',
            'order.none': 'Koi service select nahi',
            'order.details': 'Apna Detail',
            'order.summary': 'Order da Summary',
            'order.empty': 'Koi service select nahi',
            'order.note': 'Kaam shuru karan lai 50% advance lazmi hai. Final price consultation ch bataya jayega.',
            'order.submit': 'WhatsApp te Order Bhejo',
            'order.total': 'Selected Total',
            'form.name': 'Full Naam',
            'form.phone': 'Phone / WhatsApp',
            'form.email': 'Email',
            'form.budget': 'Budget Range',
            'form.budgetSel': 'Budget select karo',
            'form.notes': 'Project Notes',

            'order.title': 'اپنا آرڈر دیں',
            'order.subtitle': 'سروسز منتخب کریں، اپنی تفصیلات بھریں، جمع کرائیں۔ ہم چند منٹ میں واٹس ایپ پر تصدیق کرें گے۔',
            'order.step1': '۱۔ سروسز منتخب کریں',
            'order.step1d': 'ایک یا زیادہ سروسز منتخب کریں',
            'order.step2': '۲۔ تفصیلات بھریں',
            'order.step2d': 'نام، فون اور ضروریات',
            'order.step3': '۳۔ آرڈر جمع کرائیں',
            'order.step3d': 'ہم واٹس ایپ پر رابطہ کریں گے',
            'order.select': 'سروسز منتخب کریں',
            'order.selectAll': 'سب منتخب کریں',
            'order.none': 'کوئی سروس منتخب نہیں',
            'order.details': 'اپنی تفصیلات',
            'order.summary': 'آرڈر کی تفصیل',
            'order.empty': 'کوئی سروس منتخب نہیں',
            'order.note': 'کام شروع کرنے کے لیے 50% ایڈوانس ضروری ہے۔ حتمی قیمت مشاورت کے دوران بتائی جائے گی۔',
            'order.submit': 'واٹس ایپ پر آرڈر بھیجیں',
            'order.total': 'منتخب کل',
            'form.name': 'پورا نام',
            'form.phone': 'فون / واٹس ایپ',
            'form.email': 'ای میل',
            'form.budget': 'بیجٹ رینج',
            'form.budgetSel': 'بیجٹ منتخب کریں',
            'form.notes': 'پروجیکٹ نوٹس',

            'order.title': 'Order Lagao',
            'order.subtitle': 'Services select karo, apna detail bharo, submit karo. Hum minutes mein WhatsApp par confirm karenge.',
            'order.step1': '1. Services Chuno',
            'order.step1d': 'Ek ya zyada services chuno',
            'order.step2': '2. Details Bharo',
            'order.step2d': 'Naam, phone aur requirements',
            'order.step3': '3. Order Bhejo',
            'order.step3d': 'Hum WhatsApp par contact karenge',
            'order.select': 'Services Chuno',
            'order.selectAll': 'Sab Select Karo',
            'order.none': 'Koi service select nahi',
            'order.details': 'Apna Detail',
            'order.summary': 'Order Summary',
            'order.empty': 'Koi service select nahi',
            'order.note': 'Kaam shuru karane ke liye 50% advance zaruri hai. Final price consultation mein bataya jayega.',
            'order.submit': 'WhatsApp par Order Bhejo',
            'order.total': 'Selected Total',
            'form.name': 'Full Name',
            'form.phone': 'Phone / WhatsApp',
            'form.email': 'Email',
            'form.budget': 'Budget Range',
            'form.budgetSel': 'Budget select karo',
            'form.notes': 'Project Notes',

            'order.title': 'Place Your Order',
            'order.subtitle': 'Select services, enter your details, and submit. We will confirm on WhatsApp within minutes.',
            'order.step1': '1. Choose Services',
            'order.step1d': 'Select one or more services',
            'order.step2': '2. Enter Details',
            'order.step2d': 'Name, phone & requirements',
            'order.step3': '3. Submit Order',
            'order.step3d': 'We contact you on WhatsApp',
            'order.select': 'Select Services',
            'order.selectAll': 'Select All',
            'order.none': 'No services selected',
            'order.details': 'Your Details',
            'order.summary': 'Order Summary',
            'order.empty': 'No services selected',
            'order.note': '50% advance required to start any service. Exact final price shared during consultation.',
            'order.submit': 'Submit Order via WhatsApp',
            'order.total': 'Total Selected',
            'form.name': 'Full Name',
            'form.phone': 'Phone / WhatsApp',
            'form.email': 'Email',
            'form.budget': 'Budget Range',
            'form.budgetSel': 'Select budget',
            'form.notes': 'Project Notes',
            'nav.contact': 'Contact',
            'hero.title': 'Digital Services That Grow Your Business',
            'hero.subtitle': 'Professional websites, social media, mobile repair, Google My Business, POS systems, and more — all in Malakwal.',
            'hero.cta': 'Get Started',
            'hero.whatsapp': 'WhatsApp Us',
            'services.tag': 'What We Do',
            'services.title': 'Our <span class="gradient-text">Services</span>',
            'services.subtitle': 'End-to-end digital solutions tailored for restaurants, hotels, and local businesses.',
            'payment.tag': 'Easy Payment',
            'payment.title': 'Pay <span class="gradient-text">Securely</span>',
            'payment.subtitle': 'Pay via JazzCash or Easypaisa — <strong>50% advance required</strong> before work begins.',
            'about.tag': 'Why Clients Trust Us',
            'about.tag2': 'About Us',
            'about.title': 'Our <span class="gradient-text">Approach</span>',
            'about.title2': 'Meet <span class="gradient-text">Zave</span>',
            'about.subtitle': 'We let our work speak for itself. Here’s what makes us different.',
            'about.p1': 'Hey! I’m <strong>Zave</strong> — a digital marketing specialist and hotel management professional based in <strong>Malakwal, Punjab, Pakistan</strong>.',
            'about.p2': 'With hands-on experience in the restaurant industry (running <strong>The Pizza House</strong> at DC Chowk, Sargodha Road, Mandi Bahauddin — famous for our <strong>Cheese Lover</strong> pizza and 9 premium flavors) and a background in hotel management (HTML Level 5 certified), I understand the challenges local businesses face when going digital.',
            'about.p3': 'That’s why I started <strong>Zave Digital</strong> — to help restaurants, hotels, and small businesses build their online presence, attract more customers, and grow — without breaking the bank.',
            'contact.tag': 'Get In Touch',
            'contact.title': 'Contact <span class="gradient-text">Us</span>',
            'contact.subtitle': 'Ready to grow your business? Reach out and let’s discuss how we can help.',
            'footer.rights': '© 2026 Zave Digital. All rights reserved.',
            'footer.made': 'Made with <i class="fas fa-heart" style="color:#e74c3c"></i> in Mandi Bahauddin'
        },
        'roman-urdu': {
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.testimonials': 'Testimonials',
            'nav.portfolio': 'Portfolio',
            'nav.order': 'Order',
            'nav.patients': 'Zave for Patients',
            'nav.contact': 'Contact',
            'hero.title': 'Digital Services Jo Aap Ke Business Ko Barhayein',
            'hero.subtitle': 'Professional websites, social media, mobile repair, Google My Business, POS systems, aur bhi bohot kuch — sab kuch Malakwal mein.',
            'hero.cta': 'Shuru Karein',
            'hero.whatsapp': 'WhatsApp Karein',
            'services.tag': 'Hum Kya Karte Hain',
            'services.title': 'Hamari <span class="gradient-text">Services</span>',
            'services.subtitle': 'Restaurants, hotels, aur local businesses ke liye end-to-end digital solutions.',
            'payment.tag': 'Aasan Payment',
            'payment.title': 'Bharein <span class="gradient-text">Securely</span>',
            'payment.subtitle': 'JazzCash ya Easypaisa se bharein — <strong>50% advance zaruri hai</strong> kaam shuru hone se pehle.',
            'about.tag': 'Clients Humein Qyun Bharosay Karte Hain',
            'about.tag2': 'Hamare Baare Mein',
            'about.title': 'Hamara <span class="gradient-text">Approach</span>',
            'about.title2': 'Milayein <span class="gradient-text">Zave</span> Se',
            'about.subtitle': 'Hum apne kaam se baat karte hain. Yehi humein alag banata hai.',
            'about.p1': 'Hey! Main <strong>Zave</strong> hoon — ek digital marketing specialist aur hotel management professional, <strong>Malakwal, Punjab, Pakistan</strong> ka rehne wala.',
            'about.p2': 'Restaurant industry ka praktikal experience (hum <strong>The Pizza House</strong> chalate hain DC Chowk, Sargodha Road, Mandi Bahauddin — apne <strong>Cheese Lover</strong> pizza aur 9 premium flavors ke liye mashhoor) aur hotel management background (HTML Level 5 certified) ke sath, main samajhta hoon local businesses ko digital hone mein kya mushkilein aati hain.',
            'about.p3': 'Isliye maine <strong>Zave Digital</strong> shuru kiya — taake restaurants, hotels, aur chote businesses apni online presence bana sakein, zyada customers attract karein, aur grow karein — bina zyada kharch ke.',
            'contact.tag': 'Hum Se Milen',
            'contact.title': 'Milen <span class="gradient-text">Hum Se</span>',
            'contact.subtitle': 'Apna business barhana tayar hain? Reach out karein aur hum baat karein ke hum kaise help kar sakte hain.',
            'footer.rights': '© 2026 Zave Digital. Tamam huquq mahfuz hain.',
            'footer.made': 'Banaya gaya <i class="fas fa-heart" style="color:#e74c3c"></i> Mandi Bahauddin mein'
        },
        urdu: {
            'nav.home': 'ہوم',
            'nav.services': 'سروسز',
            'nav.testimonials': 'تاثرات',
            'nav.portfolio': 'پورٹ فولیو',
            'nav.order': ' آرڈر',
            'nav.patients': 'زاوے فار پیشکش',
            'nav.contact': 'رابطہ',
            'hero.title': 'ڈیجیٹل سروسز جو آپ کا کاروبار بڑھائیں',
            'hero.subtitle': 'پروفیشنل ویب سائٹس، سوشل میڈیا، موبائل ریپیئر، Google My Business، POS سسٹمز، اور بہت کچھ — سب کچھ ملکوال میں۔',
            'hero.cta': 'شروع کریں',
            'hero.whatsapp': 'واٹس ایپ کریں',
            'services.tag': 'ہم کیا کرتے ہیں',
            'services.title': 'ہماری <span class="gradient-text">سروسز</span>',
            'services.subtitle': 'ریستورانٹس، ہوٹلز، اور مقامی کاروباروں کے لیے اینڈ ٹو اینڈ ڈیجیٹل حل۔',
            'payment.tag': 'آسان ادائیگی',
            'payment.title': 'ادائیگی کریں <span class="gradient-text">محفوظ طریقے سے</span>',
            'payment.subtitle': 'JazzCash یا Easypaisa سے ادائیگی کریں — <strong>50% ایڈوانس ضروری ہے</strong> کام شروع ہونے سے پہلے۔',
            'about.tag': 'کلائنٹس ہم پر بھروسہ کیوں کرتے ہیں',
            'about.tag2': 'ہمارے بارے میں',
            'about.title': 'ہمارا <span class="gradient-text">طریقہ کار</span>',
            'about.title2': 'ملیے <span class="gradient-text">Zave</span> سے',
            'about.subtitle': 'ہم اپنے کام سے بات کرتے ہیں۔ یہی ہمیں مختلف بناتا ہے۔',
            'about.p1': 'ہیلو! میں <strong>Zave</strong> ہوں — ایک ڈیجیٹل مارکیٹنگ اسپیشلسٹ اور ہوٹل مینجمنٹ پروفیشنل، <strong>ملکوال، پنجاب، پاکستان</strong> کا رہنے والا۔',
            'about.p2': 'ریستورانٹ انڈسٹری کا عملی تجربہ (ہم <strong>The Pizza House</strong> چلاتے ہیں DC Chowk، Sargodha Road، Mandi Bahauddin — اپنے <strong>Cheese Lover</strong> پیزا اور 9 پریمیم فلیورز کے لیے مشہور) اور ہوٹل مینجمنٹ کی پس منظر (HTML Level 5 سرٹیفائیڈ) کے ساتھ، میں سمجھتا ہوں مقامی کاروباروں کو ڈیجیٹل ہوتے وقت کیا مشکلات آتی ہیں۔',
            'about.p3': 'اسی لیے میں نے <strong>Zave Digital</strong> شروع کی — تاکہ ریستورانٹس، ہوٹلز، اور چھوٹے کاروبار اپنی آن لائن موجودگی بنائیں، زیادہ گاہکوں کو اپنی طرف متوجہ کریں، اور بڑھیں — بغیر زیادہ خرچ کے۔',
            'contact.tag': 'ہم سے رابطہ کریں',
            'contact.title': 'رابطہ کریں <span class="gradient-text">ہم سے</span>',
            'contact.subtitle': 'اپنا کاروبار بڑھانے کے لیے تیار ہیں؟ رابطہ کریں اور بات کرتے ہیں کہ ہم کیسے مدد کر سکتے ہیں۔',
            'footer.rights': '© 2026 Zave Digital. تمام حقوق محفوظ ہیں۔',
            'footer.made': 'بنایا گیا <i class="fas fa-heart" style="color:#e74c3c"></i> ملکوال میں'
        },
        punjabi: {
            'nav.home': 'گھر',
            'nav.services': 'سروساں',
            'nav.testimonials': 'گواہیاں',
            'nav.portfolio': 'پورٹ فولیو',
            'nav.order': ' آرڈر',
            'nav.patients': 'زاوے فار پیشکش',
            'nav.contact': 'رابطہ',
            'hero.title': 'ڈیجیٹل سروساں جو تہاڈے کاروبار نوں ودھاؤن',
            'hero.subtitle': 'پروفیشنل ویب سائٹاں، سوشل میڈیا، موبائل ریپیئر، Google My Business، POS سسٹم، تے بہت کجھ — سارا ملکوال وچ۔',
            'hero.cta': 'شروع کرو',
            'hero.whatsapp': 'واٹس ایپ کرو',
            'services.tag': 'اسیں کی کرے آں',
            'services.title': 'ساڈیاں <span class="gradient-text">سروساں</span>',
            'services.subtitle': 'ریستورانٹاں، ہوٹلاں، تے مقامی کاروباراں لئی اینڈ ٹو اینڈ ڈیجیٹل حل۔',
            'payment.tag': 'آسان ادائیگی',
            'payment.title': 'ادائیگی کرو <span class="gradient-text">محفوظ طریقے نال</span>',
            'payment.subtitle': 'JazzCash یا Easypaisa نال ادائیگی کرو — <strong>50% ایڈوانس ضروری اے</strong> کم شروع ہون توں پہلے۔',
            'about.tag': 'کلائنٹ ساڈے تے بھروسہ کیوں کرن',
            'about.tag2': 'ساڈے بارے وچ',
            'about.title': 'ساڈا <span class="gradient-text">طریقہ</span>',
            'about.title2': 'ملو <span class="gradient-text">Zave</span> نوں',
            'about.subtitle': 'اسیں اپنے کم نال گل کرے آں۔ ایہی ساڈے نوں وکھرا کردا اے۔',
            'about.p1': 'ہیلو! میں <strong>Zave</strong> آں — اک ڈیجیٹل مارکیٹنگ اسپیشلسٹ تے ہوٹل مینجمنٹ پروفیشنل، <strong>ملکوال، پنجاب، پاکستان</strong> دا رہن والا۔',
            'about.p2': 'ریستورانٹ انڈسٹری دا عملی تجربہ (اسیں <strong>The Pizza House</strong> چلاؤندے آں DC Chowk، Sargodha Road، Mandi Bahauddin — اپنے <strong>Cheese Lover</strong> پیزا تے 9 پریمیم فلیورز لئی مشہور) تے ہوٹل مینجمنٹ دی پچھوکڑ (HTML Level 5 سرٹیفائیڈ) نال، میں سمجھدا آں مقامی کاروباراں نوں ڈیجیٹل ہون ویلے کی مشکلاں آندیاں نیں۔',
            'about.p3': 'ایس لئی میں نے <strong>Zave Digital</strong> شروع کیتا — تاکہ ریستورانٹاں، ہوٹلاں، تے چھوٹے کاروبار اپنی آن لائن موجودگی بنا سکن، ودھ گاہک لے سکن، تے ودھن — بنا بہت خرچے دے۔',
            'contact.tag': 'ساڈے نال جڑو',
            'contact.title': 'رابطہ کرو <span class="gradient-text">ساڈے نال</span>',
            'contact.subtitle': 'اپنا کاروبار ودھاؤن لئی تیار او؟ رابطہ کرو تے گل کرے آں کہ اسیں کیویں مدد کر سکدے آں۔',
            'footer.rights': '© 2026 Zave Digital. سارے حق محفوظ نیں۔',
            'footer.made': 'بنایا گیا <i class="fas fa-heart" style="color:#e74c3c"></i> ملکوال وچ'
        }
    };

    var langLabels = { en: 'EN', 'roman-urdu': 'UR', urdu: 'اردو', punjabi: 'پنجابی' };
    var STORAGE_KEY = 'zave_lang';

    function applyTranslations(lang) {
        var dict = translations[lang] || translations.en;
        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var key = el.getAttribute('data-i18n');
            if (dict[key] === undefined) continue;
            if (dict[key].indexOf('<') !== -1) {
                el.innerHTML = dict[key];
            } else {
                el.textContent = dict[key];
            }
        }
        document.documentElement.setAttribute('lang', lang);
        var btn = document.getElementById('langBtn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-globe"></i> ' + (langLabels[lang] || 'EN');
        }
        // mark active language in dropdown
        var items = document.querySelectorAll('#langDropdown li[data-lang]');
        for (var j = 0; j < items.length; j++) {
            if (items[j].getAttribute('data-lang') === lang) {
                items[j].classList.add('active');
            } else {
                items[j].classList.remove('active');
            }
        }
    }

    function setLanguage(lang) {
        if (!translations[lang]) lang = 'en';
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
        applyTranslations(lang);
    }

    function init() {
        var langBtn = document.getElementById('langBtn');
        var selector = document.getElementById('langSelector');
        var dropdown = document.getElementById('langDropdown');

        if (langBtn && selector && dropdown) {
            langBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                selector.classList.toggle('open');
            });
            document.addEventListener('click', function () {
                selector.classList.remove('open');
            });
            var items = dropdown.querySelectorAll('li[data-lang]');
            for (var i = 0; i < items.length; i++) {
                items[i].addEventListener('click', function (e) {
                    e.stopPropagation();
                    setLanguage(this.getAttribute('data-lang'));
                    selector.classList.remove('open');
                });
            }
        }

        var saved = 'en';
        try { saved = localStorage.getItem(STORAGE_KEY) || 'en'; } catch (e) {}
        applyTranslations(saved);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

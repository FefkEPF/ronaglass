/* =============================================
   RONA AUTO GLASS - MULTI-PAGE ENGINE
   Lenis smooth scroll, Loader, Active Nav Highlighting,
   Canvas Image Sequence, FAQ Search & Accordions.
============================================= */

// ============ LENIS SMOOTH SCROLL ============
// DISABLED: causing mobile scroll issues
// var lenis = null;
// if (typeof Lenis !== 'undefined') {
//     var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//     if (!isMobile) {
//         lenis = new Lenis({
//             duration: 1.5,
//             easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
//             smoothWheel: true,
//             wheelMultiplier: 1.0,
//             touchMultiplier: 1.0,
//             syncTouch: false,
//             syncTouchLerp: 0.05,
//             infinite: false
//         });
//
//         function raf(time) {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         }
//         requestAnimationFrame(raf);
//     }
// }

// ============ LOADER WITH RING ============
function hideLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(function () {
        loader.style.display = 'none';
    }, 800);
}

function startLoader() {
    var loader = document.getElementById('loader');
    var progress = document.getElementById('loader-progress');
    if (!loader || !progress) return;
    
    var p = 0;
    var iv = setInterval(function () {
        p += Math.random() * 20 + 6;
        if (p >= 100) { p = 100; clearInterval(iv); }
        progress.style.width = p + '%';
        if (p >= 100) {
            setTimeout(hideLoader, 250);
        }
    }, 60);
    setTimeout(function () {
        hideLoader();
    }, 3500);
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', startLoader);
} else {
    startLoader();
}

// ============ NAVBAR ACTIVE LINK HIGHLIGHTER & SCROLL EFFECT ============
document.addEventListener('DOMContentLoaded', function () {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-link').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            link.classList.add('active');
        } else if (!href.includes(path) && !link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
        }
    });
    
    // Navbar background change on scroll
    var navbar = document.getElementById('navbar');
    if (navbar) {
        var lastScrollY = window.scrollY;
        function handleNavScroll() {
            var currentScroll = window.scrollY;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScrollY = currentScroll;
        }
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll();
    }
});

// ============ HAMBURGER & MOBILE MENU ============
var ham = document.getElementById('hamburger'), mob = document.getElementById('mobile-menu');
if (ham && mob) {
    function toggleMenu(open) {
        var isOpen = open !== undefined ? open : !mob.classList.contains('open');
        ham.classList.toggle('active', isOpen);
        mob.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        // Prevent background scroll on iOS
        if (isOpen) {
            document.body.style.top = '-' + window.scrollY + 'px';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            var scrollY = parseInt(document.body.style.top || '0') * -1;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        }
    }

    ham.addEventListener('click', function () {
        toggleMenu();
    });

    // Close menu on link click
    document.querySelectorAll('.mobile-link').forEach(function (l) {
        l.addEventListener('click', function () {
            toggleMenu(false);
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mob.classList.contains('open')) {
            toggleMenu(false);
        }
    });
}

// ============ MOBILE TOUCH / GESTURE IMPROVEMENTS ============

// ============ IOS SAFARI VIEWPORT FIX ============
// Fix 100vh issue on iOS Safari (bottom bar overlaps)
function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', function () {
    setTimeout(setVH, 200);
});

// ============ MOBILE SCROLL HINT HIDE ============
var scrollHint = document.querySelector('.cinema-scroll-hint');
if (scrollHint) {
    var hintTimer;
    function handleScrollHint() {
        scrollHint.style.opacity = '0';
        clearTimeout(hintTimer);
        hintTimer = setTimeout(function () {
            scrollHint.style.opacity = '1';
        }, 3000);
    }
    window.addEventListener('scroll', handleScrollHint, { passive: true });
    window.addEventListener('touchmove', handleScrollHint, { passive: true });
}

// ============ LAZY LOADING FIX FOR MOBILE ============
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported, no action needed
} else {
    // Fallback: load all images immediately (older browsers)
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        img.loading = 'auto';
    });
}

// ============ LOGO GRIDS (INSURANCE / BRANDS) ============
var insuranceLogos = [
    'AksSigorta.jpg', 'AnaSigorta.jpg', 'BereketSigorta.jpg', 'DoğaSigorta.png',
    'EthicaSigorta.jpg', 'EurekoSigorta.png', 'KuruSigorta.jpg', 'MagdeburgerSigorta.jpg',
    'OrientSigorta.png', 'TürknipponSigorta.jpg', 'UnicoSigorta.jpg', 'A1-Photoroom.png',
    'AL-Photoroom.png', 'AN-Photoroom.png', 'H2-Photoroom.png', 'NE-Photoroom.png',
    'RA-Photoroom.png', 'SO-Photoroom.png', 'TRS-Photoroom.png', 'ZU-Photoroom.png',
    'ŞekerSigorta.jpg', 'GeneraliSigorta.jpg', 'HepiyiSigorta.jpg', 'AnkaraSigorta.jpg', 'AtlasSigorta.jpg'
];
var carLogos = [
    'audi-rona-1.png', 'bmw-rona-1.png', 'citroen-rona.png', 'chery-rona.png',
    'ds-rona.png', 'fiat-rona.png', 'ford-rona2.png', 'honda-rona.png',
    'hyundai-rona.png', 'mazda-rona.png', 'mercedes-rona.png', 'mini-rona.png',
    'nissan-rona.png', 'peugeot-rona.png', 'renault-rona.png', 'seat-rona.png',
    'skoda-rona.png', 'toyota-rona.png', 'volkswagen-rona.png', 'volvo-rona2.png',
    'tesla_360.png', 'mg_360.png', 'gmc_360.png'
];

function cleanLogoTitle(filename) {
    try {
        var name = decodeURIComponent(filename);
        name = name.replace(/\.(png|jpg|jpeg|webp)$/i, '');
        name = name.replace(/-(rona|Photoroom)[0-9]*/gi, '');
        name = name.replace(/_360/gi, '');
        name = name.replace(/Sigorta/gi, ' Sigorta');
        name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
        return name.trim();
    } catch (e) {
        return filename.split('.')[0];
    }
}

function renderLogoGrid(id, items, base, reverse) {
    var el = document.getElementById(id);
    if (!el) return;
    
    // Duplicate items 2x for seamless infinite marquee scrolling
    var doubleItems = items.concat(items);
    
    var trackHtml = doubleItems.map(function (name) {
        var title = cleanLogoTitle(name);
        return '<div class="logo-item" title="' + title + '">' +
            '<img src="' + base + name + '" alt="' + title + '" loading="lazy" ' +
            'data-title="' + title + '" ' +
            'onerror="this.style.display=\'none\';this.parentNode.classList.add(\'has-fallback\');">' +
            '<span class="logo-fallback">' + title + '</span>' +
            '</div>';
    }).join('');

    var marqueeClass = 'logo-marquee' + (reverse ? ' logo-marquee-reverse' : '');
    el.innerHTML = '<div class="' + marqueeClass + '"><div class="logo-track">' + trackHtml + '</div></div>';
}

document.addEventListener('DOMContentLoaded', function () {
    renderLogoGrid('insurance-grid', insuranceLogos, 'images/logos/', false);
    renderLogoGrid('brands-grid', carLogos, 'images/logos/', true);
});



// ============ GALLERY SHOW MORE ============
document.querySelectorAll('.gallery-show-more').forEach(function (galleryBtn) {
    var galleryGrid = galleryBtn.previousElementSibling;
    if (galleryGrid && galleryGrid.classList.contains('gallery-grid')) {
        var galleryItems = galleryGrid.querySelectorAll('.gallery-item');
        var visibleCount = 8;
        for (var i = visibleCount; i < galleryItems.length; i++) {
            galleryItems[i].style.display = 'none';
        }
        galleryBtn.addEventListener('click', function () {
            for (var j = visibleCount; j < galleryItems.length; j++) {
                galleryItems[j].style.display = '';
            }
            galleryBtn.style.display = 'none';
        });
    }
});

// ============ FAQ ACCORDION & SEARCH FILTER ============
document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var item = this.parentElement;
        var isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function (el) { el.classList.remove('active'); });
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

var faqSearchInput = document.getElementById('faq-search-input');
if (faqSearchInput) {
    faqSearchInput.addEventListener('input', function (e) {
        var query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.faq-item').forEach(function (item) {
            var text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// ============ LEAD GÖNDERİMİ ============
// Talebi sunucuya kaydeder; sunucu/DB ulaşılamazsa WhatsApp'a yönlendirir.
function sendLead(data, btn, btnDefaultText, afterSuccess) {
    var originalBg = btn ? btn.style.background : '';
    fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
    }).then(function () {
        if (btn) {
            btn.textContent = '✓ Talebiniz Alındı! Sizi Arayacağız';
            btn.style.background = '#27ae60';
        }
        setTimeout(function () {
            if (btn) { btn.textContent = btnDefaultText; btn.style.background = originalBg; btn.disabled = false; }
            if (afterSuccess) afterSuccess();
        }, 2500);
    }).catch(function () {
        // Yedek: talebi WhatsApp mesajı olarak ilet
        var waLink = document.querySelector('a[href*="wa.me/"]');
        var waNum = '905346943789';
        if (waLink) {
            var m = waLink.href.match(/wa\.me\/(\d+)/);
            if (m) waNum = m[1];
        }
        var text = 'Merhaba, web sitesinden talep gönderiyorum.\n' +
            'Ad: ' + (data.name || '') + '\n' +
            'Telefon: ' + (data.phone || '') +
            (data.vehicle ? '\nAraç: ' + data.vehicle : '') +
            (data.service ? '\nHizmet: ' + data.service : '') +
            (data.kasko ? '\nKasko: ' + data.kasko : '') +
            (data.message ? '\nNot: ' + data.message : '');
        window.open('https://wa.me/' + waNum + '?text=' + encodeURIComponent(text), '_blank');
        if (btn) {
            btn.textContent = 'WhatsApp üzerinden iletiliyor...';
            setTimeout(function () { btn.textContent = btnDefaultText; btn.style.background = originalBg; btn.disabled = false; }, 2500);
        }
        if (afterSuccess) setTimeout(afterSuccess, 2500);
    });
}

// ============ CONTACT FORM ============
var contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var form = e.target;
        var q = function (sel) { var el = form.querySelector(sel); return el ? el.value : ''; };
        var b = form.querySelector('.btn-primary');
        if (b) b.disabled = true;
        sendLead({
            name: q('input[aria-label="Ad Soyad"]'),
            phone: q('input[aria-label="Telefon"]'),
            service: q('select[aria-label="Hizmet Türü"]'),
            vehicle: q('input[aria-label="Araç Bilgisi"]'),
            message: q('textarea[aria-label="Mesaj"]'),
            page: location.pathname
        }, b, 'Talebi Gönder', function () { form.reset(); });
    });
}

// ============ IMAGE SEQUENCE CINEMATIC CANVAS (HOME PAGE ONLY) ============
(function () {
    var canvas = document.getElementById('cinema-canvas');
    var section = document.querySelector('.cinema-section');
    var fill = document.getElementById('cinema-progress-fill');
    var hint = document.getElementById('cinema-scroll-hint');
    var txt1 = document.getElementById('cinema-text-1');
    var txt2 = document.getElementById('cinema-text-2');
    var txt3 = document.getElementById('cinema-text-3');

    if (!canvas || !section) return;

    // Mobile detection - enable canvas with same resolution as desktop
    var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Set optimal section height for mobile so cinema scroll pins perfectly
        section.style.height = '300vh';
        section.style.setProperty('height', '300vh', 'important');
        section.style.minHeight = '300vh';
        section.style.setProperty('min-height', '300vh', 'important');
        
        // Use same resolution canvas as desktop for identical experience
        canvas.width = 1920;  // Same as desktop
        canvas.height = 1080;
        
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        var framesCount = 130;
        var images = [];
        var loaded = 0;
        var lastDrawnIndex = -1;
        
        function drawImageSafe(index) {
            if (index >= 0 && index < framesCount && images[index] && images[index].complete) {
                ctx.globalAlpha = 1;
                ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
                lastDrawnIndex = index;
            }
        }
        
        for (var i = 1; i <= framesCount; i++) {
            (function (index) {
                var img = new Image();
                var paddedIndex = index < 10 ? '00' + index : index < 100 ? '0' + index : '' + index;
                img.src = 'images/frame_' + paddedIndex + '.jpg';
                img.onload = function () {
                    loaded++;
                    if (lastDrawnIndex < 0 && index === 1) {
                        drawImageSafe(0);
                    }
                    if (fallbackTimeout) {
                        clearTimeout(fallbackTimeout);
                        fallbackTimeout = null;
                    }
                };
                img.onerror = function () { loaded++; };
                images[index - 1] = img;
            })(i);
        }
        
        var fallbackTimeout = setTimeout(function () {
            if (loaded === 0) {
                var fallback = document.createElement('div');
                fallback.className = 'cinema-fallback';
                fallback.innerHTML = '<div class="cinema-fallback-inner">' +
                    '<img src="images/logo.png" alt="Rona Auto Glass">' +
                    '<div class="cinema-fallback-content">' +
                    '<p class="cinema-tag">— ANKARA ETİMESGUT ŞAŞMAZ —</p>' +
                    '<h1>CAMDAKİ ŞEFFAF ÇÖZÜM<br><em>RONA AUTO GLASS</em></h1>' +
                    '<p class="cinema-sub">Kasko bozmadan cam değişimi. 15 dk\'da tamir.</p>' +
                    '<a href="#video-presentation" class="btn-cinema">İnceleyin ↓</a>' +
                    '</div>' +
                    '</div>';
                canvas.parentNode.insertBefore(fallback, canvas.nextSibling);
                canvas.style.opacity = '0';
                fallback.style.opacity = '1';
                
                if (txt1) txt1.style.display = 'none';
                if (txt2) txt2.style.display = 'none';
                if (txt3) txt3.style.display = 'none';
                if (hint) hint.style.display = 'none';
            }
        }, 3000);
        
        var sTop = 0, sH = 0, vH = 0, scrollable = 1;
        var targetProgress = 0, currentProgress = 0;
        
        function onResize() {
            sTop = section.offsetTop;
            sH = section.offsetHeight;
            vH = window.innerHeight;
            scrollable = Math.max(1, sH - vH);
        }
        window.addEventListener('resize', onResize);
        onResize();
        
        function updateFrame() {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            var scrolled = scrollY - sTop;
            targetProgress = Math.max(0, Math.min(1, scrolled / scrollable));
            
            // Same interpolation as desktop for consistent behavior
            currentProgress += (targetProgress - currentProgress) * 0.08;
            if (Math.abs(targetProgress - currentProgress) < 0.0001) {
                currentProgress = targetProgress;
            }
            
            var exactFrame = currentProgress * (framesCount - 1);
            var frameIdx = Math.min(framesCount - 1, Math.max(0, Math.round(exactFrame)));
            
            if (images[frameIdx] && images[frameIdx].complete) {
                ctx.globalAlpha = 1;
                ctx.drawImage(images[frameIdx], 0, 0, canvas.width, canvas.height);
                lastDrawnIndex = frameIdx;
            } else if (lastDrawnIndex >= 0) {
                drawImageSafe(lastDrawnIndex);
            }
            
            // Dynamic text overlay toggles
            if (txt1) txt1.classList.toggle('active', currentProgress >= 0.05 && currentProgress < 0.32);
            if (txt2) txt2.classList.toggle('active', currentProgress >= 0.36 && currentProgress < 0.65);
            if (txt3) txt3.classList.toggle('active', currentProgress >= 0.68 && currentProgress < 0.94);
            
            // Keep final frame clean and visible without black overlay fill
            
            if (fill) {
                fill.style.transform = 'scaleX(' + currentProgress + ')';
            }
            
            if (hint) {
                hint.style.opacity = currentProgress > 0.02 ? '0' : '1';
            }
            
            requestAnimationFrame(updateFrame);
        }
        
        setTimeout(function () {
            onResize();
            // Initialize with first text active immediately
            if (txt1) {
                txt1.style.display = 'block';
                txt1.classList.add('active');
            }
            if (txt2) {
                txt2.style.display = 'block';
                txt2.classList.remove('active');
            }
            if (txt3) {
                txt3.style.display = 'block';
                txt3.classList.remove('active');
            }
            if (hint) {
                hint.style.display = 'block';
                hint.style.opacity = '1';
            }
            requestAnimationFrame(updateFrame);
        }, 200);
        
        return;
    }

    var ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var framesCount = 130;
    var images = [];
    var loaded = 0;
    var lastDrawnIndex = -1;

    function drawImageSafe(index) {
        if (index >= 0 && index < framesCount && images[index] && images[index].complete) {
            ctx.globalAlpha = 1;
            ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
            lastDrawnIndex = index;
        }
    }

    for (var i = 1; i <= framesCount; i++) {
        (function (index) {
            var img = new Image();
            var paddedIndex = index < 10 ? '00' + index : index < 100 ? '0' + index : '' + index;
            img.src = 'images/frame_' + paddedIndex + '.jpg';
            img.onload = function () {
                loaded++;
                if (lastDrawnIndex < 0 && index === 1) {
                    drawImageSafe(0);
                }
                if (fallbackTimeout) {
                    clearTimeout(fallbackTimeout);
                    fallbackTimeout = null;
                }
            };
            img.onerror = function () { loaded++; };
            images[index - 1] = img;
        })(i);
    }

    var fallbackTimeout = setTimeout(function () {
        if (loaded === 0) {
            var fallback = document.createElement('div');
            fallback.className = 'cinema-fallback';
            fallback.innerHTML = '<div class="cinema-fallback-inner">' +
                '<img src="images/logo.png" alt="Rona Auto Glass">' +
                '<div class="cinema-fallback-content">' +
                '<p class="cinema-tag">— ANKARA ETİMESGUT ŞAŞMAZ —</p>' +
                '<h1>CAMDAKİ ŞEFFAF ÇÖZÜM<br><em>RONA AUTO GLASS</em></h1>' +
                '<p class="cinema-sub">Kasko bozmadan cam değişimi. 15 dk\'da tamir.</p>' +
                '<a href="#video-presentation" class="btn-cinema">İnceleyin ↓</a>' +
                '</div>' +
                '</div>';
            canvas.parentNode.insertBefore(fallback, canvas.nextSibling);
            canvas.style.opacity = '0';
            fallback.style.opacity = '1';
            
            // Hide cinema text overlays
            if (txt1) txt1.style.display = 'none';
            if (txt2) txt2.style.display = 'none';
            if (txt3) txt3.style.display = 'none';
            if (hint) hint.style.display = 'none';
        }
    }, 3000);

    var sTop = 0, sH = 0, vH = 0, scrollable = 1;
    var targetProgress = 0, currentProgress = 0;

    function onResize() {
        sTop = section.offsetTop;
        sH = section.offsetHeight;
        vH = window.innerHeight;
        scrollable = Math.max(1, sH - vH);
    }
    window.addEventListener('resize', onResize);
    onResize();

    function updateFrame() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;

        var scrolled = scrollY - sTop;
        targetProgress = Math.max(0, Math.min(1, scrolled / scrollable));

        // Smooth momentum interpolation
        currentProgress += (targetProgress - currentProgress) * 0.08;
        if (Math.abs(targetProgress - currentProgress) < 0.0001) {
            currentProgress = targetProgress;
        }

        var exactFrame = currentProgress * (framesCount - 1);
        var frameIdx = Math.min(framesCount - 1, Math.max(0, Math.round(exactFrame)));

        if (images[frameIdx] && images[frameIdx].complete) {
            ctx.globalAlpha = 1;
            ctx.drawImage(images[frameIdx], 0, 0, canvas.width, canvas.height);
            lastDrawnIndex = frameIdx;
        } else if (lastDrawnIndex >= 0) {
            drawImageSafe(lastDrawnIndex);
        }

        // Dynamic text overlay toggles
        if (txt1) txt1.classList.toggle('active', currentProgress >= 0.05 && currentProgress < 0.32);
        if (txt2) txt2.classList.toggle('active', currentProgress >= 0.36 && currentProgress < 0.65);
        if (txt3) txt3.classList.toggle('active', currentProgress >= 0.68 && currentProgress < 0.94);

        // Keep final frame clean and visible without black overlay fill

        if (fill) {
            fill.style.transform = 'scaleX(' + currentProgress + ')';
        }

        if (hint) {
            hint.style.opacity = currentProgress > 0.02 ? '0' : '1';
        }

        requestAnimationFrame(updateFrame);
    }

    setTimeout(function () {
        onResize();
        // Initialize with first text active
        if (txt1) {
            txt1.style.display = 'block';
            txt1.classList.add('active');
        }
        if (txt2) {
            txt2.style.display = 'block';
            txt2.classList.remove('active');
        }
        if (txt3) {
            txt3.style.display = 'block';
            txt3.classList.remove('active');
        }
        if (hint) {
            hint.style.display = 'block';
            hint.style.opacity = '1';
        }
        requestAnimationFrame(updateFrame);
    }, 100);
})();

// ============ SCROLL REVEAL ANIMATIONS ============
(function () {
    var observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Keep observing so elements animate each time they enter
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-scale-light, .reveal-rotate').forEach(function (el) {
        observer.observe(el);
    });
})();

// ============ 3D TILT HOVER EFFECT FOR CARDS ============
(function () {
    var cards = document.querySelectorAll('.highlight-card, .service-card, .blog-card, .ref-card, .stat-item');
    
    cards.forEach(function (card) {
        card.classList.add('tilt-card');
        
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / centerY * -8;
            var rotateY = (x - centerX) / centerX * 8;
            
            card.style.setProperty('--tilt-x', rotateX + 'deg');
            card.style.setProperty('--tilt-y', rotateY + 'deg');
            
            // Update mouse position for radial gradient
            var percentX = (x / rect.width) * 100;
            var percentY = (y / rect.height) * 100;
            card.style.setProperty('--mouse-x', percentX + '%');
            card.style.setProperty('--mouse-y', percentY + '%');
        });
        
        card.addEventListener('mouseleave', function () {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        });
    });
})();

// ============ PAGE TRANSITION OVERLAY ============
(function () {
    var overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
    
    document.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('wa.me') || href.startsWith('https://wa.me')) {
                return;
            }
            if (this.getAttribute('target') === '_blank') return;
            if (this.classList.contains('open-modal') || this.classList.contains('cta-btn')) return;
            
            var isSamePage = window.location.pathname.split('/').pop() === href || 
                           (href === 'index.html' && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')));
            
            if (!isSamePage && href.endsWith('.html')) {
                e.preventDefault();
                overlay.classList.add('active');
                var target = href;
                setTimeout(function () {
                    window.location.href = target;
                }, 400);
            }
        });
    });
})();

// ============ FLOATING CTA ENHANCEMENTS ============
(function () {
    var cta = document.querySelector('.floating-cta');
    if (cta) {
        cta.classList.remove('hidden');
    }
})();

// ============ APPOINTMENT MODAL ============
(function () {
    function getModal() {
        return document.getElementById('appointment-modal');
    }

    function openModal() {
        var modal = getModal();
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        var modal = getModal();
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Global event delegation for all modal triggers (works anytime, anywhere)
    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('.open-modal, [data-modal="appointment-modal"]');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
            return;
        }

        var closeBtn = e.target.closest('#modal-close');
        if (closeBtn) {
            e.preventDefault();
            closeModal();
            return;
        }

        var modal = getModal();
        if (modal && e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        var modal = getModal();
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeModal();
        }
    });

    document.addEventListener('submit', function (e) {
        if (e.target && e.target.id === 'modal-appointment-form') {
            e.preventDefault();
            var form = e.target;
            var btn = form.querySelector('.modal-submit');
            var originalText = btn ? btn.textContent : '';
            if (btn) btn.disabled = true;
            var val = function (id) { var el = form.querySelector('#' + id); return el ? el.value : ''; };
            var kaskoEl = form.querySelector('input[name="kasko"]:checked');
            sendLead({
                name: val('modal-name'),
                phone: val('modal-phone'),
                vehicle: val('modal-vehicle'),
                service: val('modal-service'),
                kasko: kaskoEl ? kaskoEl.value : '',
                page: location.pathname
            }, btn, originalText, function () {
                form.reset();
                closeModal();
            });
        }
    });
})();

// ============ REFERENCE IMAGE LIGHTBOX MODAL ============
(function () {
    function initRefLightbox() {
        var refCards = document.querySelectorAll('.ref-card');
        if (!refCards.length) return;

        var lightbox = document.getElementById('ref-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'ref-lightbox';
            lightbox.className = 'ref-lightbox';
            lightbox.innerHTML = 
                '<div class="ref-lightbox-content">' +
                    '<button class="ref-lightbox-close" id="ref-lightbox-close" aria-label="Kapat">&times;</button>' +
                    '<img class="ref-lightbox-img" id="ref-lightbox-img" src="" alt="Referans Belgesi">' +
                    '<div class="ref-lightbox-caption" id="ref-lightbox-caption"></div>' +
                '</div>';
            document.body.appendChild(lightbox);
        }

        var lightboxImg = document.getElementById('ref-lightbox-img');
        var lightboxCaption = document.getElementById('ref-lightbox-caption');

        refCards.forEach(function (card) {
            var imgBox = card.querySelector('.ref-img-box');
            if (imgBox && !imgBox.querySelector('.ref-img-zoom-hint')) {
                var hint = document.createElement('div');
                hint.className = 'ref-img-zoom-hint';
                hint.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Büyüt';
                imgBox.appendChild(hint);
            }

            card.addEventListener('click', function (e) {
                var img = card.querySelector('.ref-img');
                var title = card.querySelector('.ref-title');
                var badge = card.querySelector('.ref-badge');

                if (img && img.src) {
                    lightboxImg.src = img.src;
                    var captionText = (title ? title.textContent : '') + (badge ? ' - ' + badge.textContent : '');
                    lightboxCaption.textContent = captionText;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeLightbox() {
            if (lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        document.addEventListener('click', function (e) {
            if (e.target.closest('#ref-lightbox-close') || e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRefLightbox);
    } else {
        initRefLightbox();
    }
})();

// ============ TEMBEL VİDEO YÜKLEME ============
// Videolar ekrana girene kadar indirilmez; sayfa açılışında ~4.5 MB tasarruf.
(function () {
    function initLazyVideos() {
        var videos = document.querySelectorAll('video.lazy-video');
        if (!videos.length) return;

        function load(video) {
            if (video.dataset.loaded) return;
            video.dataset.loaded = '1';
            var source = video.querySelector('source[data-src]');
            if (source) {
                source.src = source.dataset.src;
                source.removeAttribute('data-src');
                video.load();
            }
            var playPromise = video.play();
            if (playPromise && playPromise.catch) playPromise.catch(function () { /* otomatik oynatma engellenmiş olabilir */ });
        }

        if (!('IntersectionObserver' in window)) {
            videos.forEach(load); // eski tarayıcılar: hemen yükle
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    load(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '300px' }); // görünmeden biraz önce başlat

        videos.forEach(function (v) { io.observe(v); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyVideos);
    } else {
        initLazyVideos();
    }
})();

// ============ GOOGLE YORUMLARI KARUSELİ ============
// Merkez kart öne çıkar, yanlar soluk (coverflow); ok/nokta/kaydırma/otomatik oynatma.
(function () {
    function initReviews() {
        var track = document.getElementById('rev-track');
        if (!track) return;
        var cards = Array.prototype.slice.call(track.children);
        var n = cards.length;
        if (!n) return;
        var idx = 0, timer = null;

        var dotsWrap = document.getElementById('rev-dots');
        var dots = [];
        if (dotsWrap) {
            cards.forEach(function (_, i) {
                var d = document.createElement('button');
                d.className = 'rev-dot';
                d.setAttribute('aria-label', (i + 1) + '. yorum');
                d.addEventListener('click', function () { go(i); restart(); });
                dotsWrap.appendChild(d);
                dots.push(d);
            });
        }

        function render() {
            var narrow = window.innerWidth <= 768;
            var shift = narrow ? 88 : 62;
            cards.forEach(function (card, i) {
                var d = i - idx;
                if (d > n / 2) d -= n;
                if (d < -n / 2) d += n;
                var abs = Math.abs(d);
                var scale = abs === 0 ? 1 : abs === 1 ? 0.86 : 0.74;
                card.style.transform = 'translateX(' + (d * shift) + '%) scale(' + scale + ')';
                card.style.opacity = abs === 0 ? '1' : abs === 1 ? (narrow ? '0.25' : '0.45') : '0';
                card.style.zIndex = String(10 - abs);
                card.style.pointerEvents = abs === 0 ? 'auto' : 'none';
                card.classList.toggle('active', abs === 0);
                card.setAttribute('aria-hidden', abs === 0 ? 'false' : 'true');
            });
            dots.forEach(function (dot, i) { dot.classList.toggle('active', i === idx); });
        }

        function go(i) { idx = ((i % n) + n) % n; render(); }
        function next() { go(idx + 1); }
        function prev() { go(idx - 1); }
        function restart() {
            if (timer) clearInterval(timer);
            timer = setInterval(next, 5000);
        }

        var prevBtn = document.getElementById('rev-prev');
        var nextBtn = document.getElementById('rev-next');
        if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });

        // dokunmatik kaydırma
        var startX = null;
        track.parentElement.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        track.parentElement.addEventListener('touchend', function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
            startX = null;
        }, { passive: true });

        // kart yüksekliğine göre alan ayarla
        function fitHeight() {
            var h = 0;
            cards.forEach(function (c) { h = Math.max(h, c.offsetHeight); });
            if (h) track.parentElement.style.minHeight = (h + 40) + 'px';
        }

        window.addEventListener('resize', function () { render(); fitHeight(); });
        render();
        fitHeight();
        setTimeout(fitHeight, 400); // fontlar yüklenince tekrar ölç
        restart();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReviews);
    } else {
        initReviews();
    }
})();

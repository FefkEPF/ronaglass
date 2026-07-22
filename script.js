/* =============================================
   RONA AUTO GLASS - MULTI-PAGE ENGINE
   Lenis smooth scroll, Loader, Active Nav Highlighting,
   Canvas Image Sequence, FAQ Search & Accordions.
============================================= */

// ============ LENIS SMOOTH SCROLL ============
var lenis = null;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
        infinite: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ============ LOADER ============
function hideLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(function() {
        loader.style.display = 'none';
    }, 800);
}

function startLoader() {
    var loader = document.getElementById('loader');
    var progress = document.getElementById('loader-progress');
    if (!loader || !progress) return;
    var p = 0;
    var iv = setInterval(function() {
        p += Math.random() * 20 + 6;
        if (p >= 100) { p = 100; clearInterval(iv); }
        progress.style.width = p + '%';
        if (p >= 100) {
            setTimeout(hideLoader, 250);
        }
    }, 60);
    setTimeout(function() {
        hideLoader();
    }, 3500);
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', startLoader);
} else {
    startLoader();
}

// ============ NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTER ============
var navbar = document.getElementById('navbar');

function updateNavbar() {
    var sy = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);
    if (navbar) {
        navbar.classList.toggle('scrolled', sy > 40);
    }
}

if (lenis) {
    lenis.on('scroll', updateNavbar);
} else {
    window.addEventListener('scroll', updateNavbar, { passive: true });
}

// Highlight active page link based on URL filename
document.addEventListener('DOMContentLoaded', function() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-link').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            link.classList.add('active');
        } else if (!href.includes(path) && !link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
        }
    });
});

// ============ HAMBURGER & MOBILE MENU ============
var ham = document.getElementById('hamburger'), mob = document.getElementById('mobile-menu');
if (ham && mob) {
    ham.addEventListener('click', function() {
        ham.classList.toggle('active');
        mob.classList.toggle('open');
    });
    document.querySelectorAll('.mobile-link').forEach(function(l) {
        l.addEventListener('click', function() {
            ham.classList.remove('active');
            mob.classList.remove('open');
        });
    });
}

// ============ LOGO GRIDS (INSURANCE / BRANDS) ============
var insuranceLogos = [
    'AksSigorta.jpg','AnaSigorta.jpg','BereketSigorta.jpg','Do%C4%9FaSigorta.png',
    'EthicaSigorta.jpg','EurekoSigorta.png','KuruSigorta.jpg','MagdeburgerSigorta.jpg',
    'OrientSigorta.png','T%C3%BCrknipponSigorta.jpg','UnicoSigorta.jpg','A1-Photoroom.png',
    'AL-Photoroom.png','AN-Photoroom.png','H2-Photoroom.png','NE-Photoroom.png',
    'RA-Photoroom.png','SO-Photoroom.png','TRS-Photoroom.png','ZU-Photoroom.png',
    '%C5%9EekerSigorta.jpg','GeneraliSigorta.jpg','HepiyiSigorta.jpg','AnkaraSigorta.jpg','AtlasSigorta.jpg'
];
var carLogos = [
    'audi-rona-1.png','bmw-rona-1.png','citroen-rona.png','chery-rona.png',
    'ds-rona.png','fiat-rona.png','ford-rona2.png','honda-rona.png',
    'hyundai-rona.png','mazda-rona.png','mercedes-rona.png','mini-rona.png',
    'nissan-rona.png','peugeot-rona.png','renault-rona.png','seat-rona.png',
    'skoda-rona.png','toyota-rona.png','volkswagen-rona.png','volvo-rona2.png',
    'tesla_360.png','mg_360.png','gmc_360.png'
];

function renderLogoGrid(id, items, base) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(function(name) {
        return '<div class="logo-item"><img src="' + base + name + '" alt="" loading="lazy"></div>';
    }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    renderLogoGrid('insurance-grid', insuranceLogos, 'https://ronaglass.com.tr/img/sigorta/');
    renderLogoGrid('brands-grid', carLogos, 'https://ronaglass.com.tr/img/car-logos/');
});

// ============ FAQ ACCORDION & SEARCH FILTER ============
document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var item = this.parentElement;
        var isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function(el) { el.classList.remove('active'); });
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

var faqSearchInput = document.getElementById('faq-search-input');
if (faqSearchInput) {
    faqSearchInput.addEventListener('input', function(e) {
        var query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.faq-item').forEach(function(item) {
            var text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// ============ CONTACT FORM ============
var contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var b = e.target.querySelector('.btn-primary');
        if (b) {
            b.textContent = '✓ Talebiniz Alındı! Sizi Arayacağız';
            b.style.background = '#27ae60';
        }
        setTimeout(function() {
            if (b) {
                b.textContent = 'Talebi Gönder';
                b.style.background = '';
            }
            e.target.reset();
        }, 3000);
    });
}

// ============ IMAGE SEQUENCE CINEMATIC CANVAS (HOME PAGE ONLY) ============
(function() {
    var canvas = document.getElementById('cinema-canvas');
    var section = document.querySelector('.cinema-section');
    var fill = document.getElementById('cinema-progress-fill');
    var hint = document.getElementById('cinema-scroll-hint');
    var txt1 = document.getElementById('cinema-text-1');
    var txt2 = document.getElementById('cinema-text-2');
    var txt3 = document.getElementById('cinema-text-3');

    if (!canvas || !section) return;

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
        (function(index) {
            var img = new Image();
            var paddedIndex = index < 10 ? '00' + index : index < 100 ? '0' + index : '' + index;
            img.src = 'images/frame_' + paddedIndex + '.jpg';
            img.onload = function() {
                loaded++;
                if (lastDrawnIndex < 0 && index === 1) {
                    drawImageSafe(0);
                }
            };
            img.onerror = function() { loaded++; };
            images[index - 1] = img;
        })(i);
    }

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
        var scrollY = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);

        var scrolled = scrollY - sTop;
        targetProgress = Math.max(0, Math.min(1, scrolled / scrollable));

        // Smooth momentum interpolation
        currentProgress += (targetProgress - currentProgress) * 0.12;
        if (Math.abs(targetProgress - currentProgress) < 0.0002) {
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
        if (txt1) txt1.classList.toggle('active', currentProgress >= 0.02 && currentProgress < 0.32);
        if (txt2) txt2.classList.toggle('active', currentProgress >= 0.36 && currentProgress < 0.65);
        if (txt3) txt3.classList.toggle('active', currentProgress >= 0.68 && currentProgress < 0.94);

        // Smooth overlay fade to black near end of sequence
        if (currentProgress > 0.88) {
            var fadeToBlack = Math.min(1, (currentProgress - 0.88) / 0.12);
            ctx.globalAlpha = fadeToBlack;
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (fill) {
            fill.style.transform = 'scaleX(' + currentProgress + ')';
        }

        if (hint) {
            hint.style.opacity = currentProgress > 0.02 ? '0' : '1';
        }

        requestAnimationFrame(updateFrame);
    }

    setTimeout(function() {
        onResize();
        requestAnimationFrame(updateFrame);
    }, 50);
})();

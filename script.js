/* =============================================
   RONA AUTO GLASS - CINEMATIC SCROLL
   Loader, navbar, mobile menu, smooth scroll
   + image-sequence cinematic scroll only.
============================================= */

// ============ LOADER ============
window.addEventListener('load', function() {
    var loader = document.getElementById('loader');
    var progress = document.getElementById('loader-progress');
    var p = 0;
    var iv = setInterval(function() {
        p += Math.random() * 20 + 6;
        if (p >= 100) { p = 100; clearInterval(iv); }
        progress.style.width = p + '%';
        if (p === 100) setTimeout(function() {
            loader.classList.add('hidden');
            setTimeout(onResize, 350);
        }, 300);
    }, 70);
});

// ============ NAVBAR ============
var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    var coll = document.getElementById('collection');
    if (coll) {
        navbar.classList.toggle('force-show', window.scrollY >= coll.offsetTop - 80);
    }

    var secs = document.querySelectorAll('section');
    var links = document.querySelectorAll('.nav-link');
    var cur = '';
    secs.forEach(function(s) { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });

    if (cur !== '') {
        links.forEach(function(l) {
            var href = l.getAttribute('href');
            if (href && href.includes('#' + cur)) {
                document.querySelectorAll('.nav-link, .mobile-link').forEach(x => x.classList.remove('active'));
                l.classList.add('active');
            }
        });
    }
});

// ============ HAMBURGER ============
var ham = document.getElementById('hamburger'), mob = document.getElementById('mobile-menu');
if (ham && mob) {
    document.querySelectorAll('.mobile-link').forEach(function(l) {
        l.addEventListener('click', function() { ham.classList.remove('active'); mob.classList.remove('open'); });
    });
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        var t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============ LOGO GRIDS (insurance / brands) ============
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

// ============ CONTACT FORM ============
var contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var b = e.target.querySelector('.btn-primary');
        if (b) { b.textContent = '✓ Gönderildi!'; b.style.background = '#27ae60'; }
        setTimeout(function() { if (b) { b.textContent = 'Gönder'; b.style.background = ''; } e.target.reset(); }, 2200);
    });
}

// ============ IMAGE SEQUENCE CINEMATIC SCROLL ============
(function() {
    var canvas = document.getElementById('cinema-canvas');
    if (!canvas) return;
    var section = document.querySelector('.cinema-section');
    var fill = document.getElementById('cinema-progress-fill');
    var hint = document.getElementById('cinema-scroll-hint');
    var collection = document.getElementById('collection');
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
                if (lastDrawnIndex < 0) {
                    drawImageSafe(index - 1);
                }
            };
            img.onerror = function() {
                loaded++;
            };
            images[index - 1] = img;
        })(i);
    }

    if (loaded === 0) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#c8a45c';
        ctx.font = '24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Yükleniyor...', canvas.width / 2, canvas.height / 2);
    }

    var sTop = 0, sH = 0, vH = 0, scrollable = 0;
    var targetProgress = 0, currentProgress = 0;
    var lastScrollY = window.pageYOffset;
    var velocity = 0;

    function onResize() {
        sTop = section.offsetTop;
        sH = section.offsetHeight;
        vH = window.innerHeight;
        scrollable = Math.max(1, sH - vH);
    }
    window.addEventListener('resize', onResize);
    onResize();

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function update() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;

        velocity = lerp(velocity, Math.abs(scrollY - lastScrollY), 0.1);
        lastScrollY = scrollY;

        if (scrollY > sTop + sH) {
             requestAnimationFrame(update);
             return;
        }

        var scrolled = scrollY - sTop;
        targetProgress = Math.max(0, Math.min(1, scrolled / scrollable));

        currentProgress = lerp(currentProgress, targetProgress, 0.08);
        if (Math.abs(targetProgress - currentProgress) < 0.001) currentProgress = targetProgress;

        var exactFrame = currentProgress * (framesCount - 1);
        var frameIdx = Math.floor(exactFrame);
        var nextFrameIdx = Math.min(framesCount - 1, Math.ceil(exactFrame));
        var alpha = exactFrame - frameIdx;

        var blurAmount = Math.min(8, velocity * 0.05);
        if (blurAmount > 0.5) {
            canvas.style.filter = 'blur(' + blurAmount + 'px)';
        } else {
            canvas.style.filter = 'none';
        }

        var fadeToBlack = 0;
        if (targetProgress > 0.80) {
            fadeToBlack = Math.min(1, (targetProgress - 0.80) / 0.20);
        }

        if (images[frameIdx] && images[frameIdx].complete) {
            ctx.globalAlpha = 1;
            ctx.drawImage(images[frameIdx], 0, 0, canvas.width, canvas.height);
            lastDrawnIndex = frameIdx;

            if (alpha > 0.01 && images[nextFrameIdx] && images[nextFrameIdx].complete) {
                ctx.globalAlpha = alpha;
                ctx.drawImage(images[nextFrameIdx], 0, 0, canvas.width, canvas.height);
            }
        } else if (lastDrawnIndex >= 0) {
            drawImageSafe(lastDrawnIndex);
        }

        if (fadeToBlack > 0) {
            ctx.globalAlpha = fadeToBlack;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (fadeToBlack >= 0.999) lastDrawnIndex = -1;

        if (fill) fill.style.transform = 'scaleX(' + currentProgress + ')';

        if (hint) hint.style.opacity = currentProgress > 0.02 ? '0' : '1';

        requestAnimationFrame(update);
    }

    setTimeout(function() {
        onResize();
        requestAnimationFrame(update);
    }, 100);

    var lastSY = 0;
    window.addEventListener('scroll', function() {
        var sy = window.pageYOffset || document.documentElement.scrollTop;

        var cTop = collection ? collection.offsetTop : 0;
        var delta = sy - lastSY;
        if (delta < 0 && sy < cTop + 50 && sy > cTop - window.innerHeight) {
            var cinBot = section.offsetTop + section.offsetHeight - window.innerHeight;
            window.scrollTo({ top: cinBot, behavior: 'smooth' });
        }
        lastSY = sy;
    }, {passive: false});
})();

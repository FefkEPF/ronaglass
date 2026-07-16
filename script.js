/* =============================================
   LUMINA EYEWEAR - ULTRA PREMIUM V3 JS
   Cinema scroll, 3D model-viewer, Snap, Cart
============================================= */

// ============ DATA ============
var products = [
    { id:1, name:"Lumina Aviator", type:"aviator", cat:"Aviator", price:18900, priceText:"₺18,900", img:"images/p1.png?v=5", desc:"24K altın kaplama çerçeve, polarize cam lensler" },
    { id:2, name:"Lumina Round", type:"round", cat:"Yuvarlak", price:15500, priceText:"₺15,500", img:"images/p2.png?v=5", desc:"Rose gold ince çerçeve, degrade kahverengi lensler" },
    { id:3, name:"Lumina Cat-Eye", type:"cateye", cat:"Cat-Eye", price:16200, priceText:"₺16,200", img:"images/p3.png?v=5", desc:"Platin gümüş çerçeve, mavi degrade lensler" },
    { id:4, name:"Lumina Bold", type:"rectangle", cat:"Dikdörtgen", price:14800, priceText:"₺14,800", img:"images/p4.png?v=5", desc:"Siyah asetat ve altın çerçeve, füme lensler" },
    { id:5, name:"Lumina Aviator II", type:"aviator", cat:"Aviator", price:21500, priceText:"₺21,500", img:"images/p1.png?v=5", desc:"Titanyum çerçeve, çift köprü, polarize lensler" },
    { id:6, name:"Lumina Round Elite", type:"round", cat:"Yuvarlak", price:19200, priceText:"₺19,200", img:"images/p2.png?v=5", desc:"18K altın kaplama, anti-reflektif lensler" },
    { id:7, name:"Lumina Cat-Eye Noir", type:"cateye", cat:"Cat-Eye", price:17800, priceText:"₺17,800", img:"images/p3.png?v=5", desc:"Mat siyah çerçeve, degrade gri lensler" },
    { id:8, name:"Lumina Bold Sport", type:"rectangle", cat:"Dikdörtgen", price:13900, priceText:"₺13,900", img:"images/p4.png?v=5", desc:"Hafif karbon fiber, UV400 koruma" },
    { id:9, name:"Lumina Tortoise Classic", type:"rectangle", cat:"Dikdörtgen", price:16500, priceText:"₺16,500", img:"images/p5.png", desc:"İtalyan asetat kaplumbağa deseni, kahverengi degrade lensler" },
    { id:10, name:"Lumina Oversize Glam", type:"cateye", cat:"Cat-Eye", price:22000, priceText:"₺22,000", img:"images/p6.png", desc:"Ekstra geniş siyah çerçeve, kalın altın sap detayları" },
    { id:11, name:"Lumina Crystal Vision", type:"aviator", cat:"Aviator", price:15800, priceText:"₺15,800", img:"images/p7.png", desc:"Şeffaf kristal çerçeve, gümüş aynalı camlar" },
    { id:12, name:"Lumina Rose Elegance", type:"round", cat:"Yuvarlak", price:19500, priceText:"₺19,500", img:"images/p8.png", desc:"Rose altın kaplama, pembe yansımalı gradient lensler" },
    { id:13, name:"Lumina Hexa Dark", type:"rectangle", cat:"Dikdörtgen", price:14200, priceText:"₺14,200", img:"images/p9.png", desc:"Mat siyah altıgen köşeler, zümrüt yeşili camlar" },
    { id:14, name:"Lumina Retro White", type:"round", cat:"Yuvarlak", price:18000, priceText:"₺18,000", img:"images/p10.png", desc:"Kalın beyaz vintage asetat, kömür karası lensler" }
];
var cart = [];

// ============ LOADER ============
window.addEventListener('load', function() {
    var loader = document.getElementById('loader');
    var progress = document.getElementById('loader-progress');
    var p = 0;
    var iv = setInterval(function() {
        p += Math.random() * 20 + 6;
        if (p >= 100) { p = 100; clearInterval(iv); }
        progress.style.width = p + '%';
        if (p === 100) setTimeout(function() { loader.classList.add('hidden'); }, 300);
    }, 70);
});



// ============ NAVBAR & ACTIVE LINKS ============
var navbar = document.getElementById('navbar');
var isIndex = document.getElementById('cinema-canvas') !== null;
var currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Highlight correct active link based on current page
document.querySelectorAll('.nav-link, .mobile-link').forEach(function(l) {
    var href = l.getAttribute('href');
    if (!href) return;
    
    // clean up href (e.g. index.html#home -> index.html)
    var targetPage = href.split('#')[0];
    if (targetPage === '') targetPage = 'index.html';
    
    // Exact match for pages, or specific section matching for index.html
    if (targetPage === currentPage) {
        if (!isIndex) {
            l.classList.add('active'); // On non-index pages, just highlight the matching page link
        }
    } else {
        l.classList.remove('active');
    }
});

if (!isIndex && navbar) {
    // Force show navbar on non-index pages
    navbar.classList.add('force-show');
    navbar.classList.add('scrolled');
}

window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (navbar) {
        if (isIndex) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
            var coll = document.getElementById('collection');
            if (coll) {
                navbar.classList.toggle('force-show', window.scrollY >= coll.offsetTop - 80);
            }
        }
    }
    
    // Only do section-based active link toggling on index.html
    if (isIndex) {
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
    }
});

// ============ HAMBURGER ============
var ham = document.getElementById('hamburger'), mob = document.getElementById('mobile-menu');
document.querySelectorAll('.mobile-link').forEach(function(l) {
    l.addEventListener('click', function() { ham.classList.remove('active'); mob.classList.remove('open'); });
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) { e.preventDefault(); var t = document.querySelector(this.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth' }); });
});

// ============ PRODUCTS ============
var grid = document.getElementById('product-grid');
function render(filter) {
    if (!grid) return;
    filter = filter || 'all';
    grid.innerHTML = '';
    
    var list = filter === 'all' ? products : products.filter(function(p) { return p.type === filter; });
    
    // On the homepage, only show the first 4 products if no filter is applied
    if (isIndex && filter === 'all') {
        list = list.slice(0, 4);
    }
    
    list.forEach(function(p, i) {
        var c = document.createElement('div');
        c.className = 'product-card';
        c.style.transitionDelay = (i * 0.05) + 's';
        c.innerHTML = '<div class="product-card-img" style="cursor:pointer;"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></div>' +
            '<div class="product-card-info"><h3 class="product-card-name">' + p.name + '</h3>' +
            '<p class="product-card-type">' + p.cat + '</p>' +
            '<div class="product-card-bottom"><span class="product-card-price">' + p.priceText + '</span>' +
            '<button class="add-to-cart-btn" data-id="' + p.id + '">Sepete Ekle</button></div></div>';
        
        c.querySelector('.product-card-img').addEventListener('click', function() {
            openProductModal(p);
        });
        
        grid.appendChild(c);
    });
    observe(); bindCart();
}

// ============ PRODUCT MODAL & TRY-ON ============
var pModal = document.getElementById('product-modal'), pModalOverlay = document.getElementById('product-modal-overlay');
var curProduct = null, webcamStream = null;

function openProductModal(p) {
    curProduct = p;
    document.getElementById('modal-img').src = p.img.split('?')[0]; // use clean src
    document.getElementById('modal-img').style.display = 'block';
    document.getElementById('webcam').style.display = 'none';
    document.getElementById('tryon-glasses').style.display = 'none';
    document.getElementById('tryon-error').style.display = 'none';
    document.getElementById('modal-tryon').textContent = 'Sanal Deneme';
    
    document.getElementById('modal-title').textContent = p.name;
    document.getElementById('modal-desc').textContent = p.desc;
    document.getElementById('modal-price').textContent = p.priceText;
    
    pModal.classList.add('open');
    pModalOverlay.classList.add('open');
}

function closeProductModal() {
    pModal.classList.remove('open');
    pModalOverlay.classList.remove('open');
    stopWebcam();
}

document.getElementById('modal-close').addEventListener('click', closeProductModal);
pModalOverlay.addEventListener('click', closeProductModal);

document.getElementById('modal-add-cart').addEventListener('click', function() {
    if(curProduct) {
        addToCart(curProduct.id);
        closeProductModal();
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
    }
});

// Mockup Virtual Try-On logic
document.getElementById('modal-tryon').addEventListener('click', function() {
    var video = document.getElementById('webcam');
    var glimg = document.getElementById('tryon-glasses');
    var btn = document.getElementById('modal-tryon');
    var err = document.getElementById('tryon-error');
    
    if (webcamStream) { stopWebcam(); return; }
    
    err.style.display = 'none';
    btn.textContent = 'Kamera Açılıyor...';
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            webcamStream = stream;
            video.srcObject = stream;
            video.style.display = 'block';
            document.getElementById('modal-img').style.display = 'none';
            glimg.src = curProduct.img.split('?')[0];
            glimg.style.display = 'block';
            btn.textContent = 'Kamerayı Kapat';
        })
        .catch(function(error) {
            console.error("Camera error:", error);
            err.textContent = "Kamera erişimi reddedildi veya bulunamadı.";
            err.style.display = 'block';
            btn.textContent = 'Sanal Deneme';
        });
});

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(function(track) { track.stop(); });
        webcamStream = null;
    }
    document.getElementById('webcam').style.display = 'none';
    document.getElementById('tryon-glasses').style.display = 'none';
    document.getElementById('modal-img').style.display = 'block';
    document.getElementById('modal-tryon').textContent = 'Sanal Deneme';
}
document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(function(x) { x.classList.remove('active'); });
        b.classList.add('active'); render(b.dataset.filter);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    render('all');
});

// ============ SCROLL ANIMATIONS ============
function observe() {
    var ob = new IntersectionObserver(function(es) { es.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.1 });
    document.querySelectorAll('.product-card').forEach(function(c) { ob.observe(c); });
}
var secOb = new IntersectionObserver(function(es) {
    es.forEach(function(e) { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
}, { threshold: 0.1 });
document.querySelectorAll('.section-header,.about-text,.about-visual,.contact-form,.contact-info,.experience-container').forEach(function(el) {
    el.style.opacity = '0'; el.style.transform = 'translateY(36px)'; el.style.transition = 'opacity .7s ease,transform .7s ease';
    secOb.observe(el);
});

// ============ COUNTERS ============
var statsGrid = document.querySelector('.about-stats');
if (statsGrid) {
    var cOb = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (e.isIntersecting) {
                var el = e.target, t = parseInt(el.dataset.count), c = 0, s = t / 50;
                var iv = setInterval(function() { c += s; if (c >= t) { c = t; clearInterval(iv); } el.textContent = Math.floor(c).toLocaleString('tr-TR'); }, 25);
                cOb.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(function(el) { cOb.observe(el); });
}

// ============ CART ============
function bindCart() {
    document.querySelectorAll('.add-to-cart-btn').forEach(function(b) {
        b.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(parseInt(b.dataset.id));
            b.textContent = '✓ Eklendi'; b.style.background = 'var(--gold)'; b.style.color = 'var(--bg)';
            setTimeout(function() { b.textContent = 'Sepete Ekle'; b.style.background = ''; b.style.color = ''; }, 1200);
        });
    });
}
function addToCart(id) {
    var p = products.find(function(x) { return x.id === id; }); if (!p) return;
    var ex = cart.find(function(x) { return x.id === id; });
    if (ex) ex.qty++; else cart.push(Object.assign({}, p, { qty: 1 }));
    updateCart();
}
function removeFromCart(id) { cart = cart.filter(function(x) { return x.id !== id; }); updateCart(); }
function updateCart() {
    var cnt = document.getElementById('cart-count'), items = document.getElementById('cart-items'), tp = document.getElementById('cart-total-price');
    var q = cart.reduce(function(s, c) { return s + c.qty; }, 0);
    cnt.textContent = q;
    if (!cart.length) { items.innerHTML = '<p class="cart-empty">Sepetiniz boş</p>'; tp.textContent = '₺0'; return; }
    items.innerHTML = cart.map(function(c) {
        return '<div class="cart-item"><img src="' + c.img + '" alt="' + c.name + '"><div class="cart-item-info"><h4>' + c.name + (c.qty > 1 ? ' (x' + c.qty + ')' : '') + '</h4><p>' + (c.price * c.qty).toLocaleString('tr-TR') + ' ₺</p></div><button class="cart-item-remove" data-id="' + c.id + '">&times;</button></div>';
    }).join('');
    tp.textContent = cart.reduce(function(s, c) { return s + c.price * c.qty; }, 0).toLocaleString('tr-TR') + ' ₺';
    items.querySelectorAll('.cart-item-remove').forEach(function(b) { b.addEventListener('click', function() { removeFromCart(parseInt(b.dataset.id)); }); });
}
var cartBtn = document.getElementById('cart-btn'), cartSidebar = document.getElementById('cart-sidebar'), cartOverlay = document.getElementById('cart-overlay'), cartClose = document.getElementById('cart-close');
cartBtn.addEventListener('click', function() { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); });
cartClose.addEventListener('click', closeCart); cartOverlay.addEventListener('click', closeCart);
function closeCart() { 
    cartSidebar.classList.remove('open'); 
    cartOverlay.classList.remove('open'); 
    setTimeout(resetCheckout, 300); // reset state when closed
}

// Checkout Logic
var btnGoCheckout = document.getElementById('go-checkout-btn');
var btnBackCart = document.getElementById('back-to-cart-btn');
var cartContent = document.getElementById('cart-content-area');
var checkoutContent = document.getElementById('checkout-content-area');
var cartTitle = document.getElementById('cart-title');
var checkoutForm = document.getElementById('checkout-form');
var orderSuccess = document.getElementById('order-success');

function resetCheckout() {
    cartContent.style.display = 'block';
    checkoutContent.style.display = 'none';
    cartTitle.textContent = 'Sepetim';
    checkoutForm.style.display = 'block';
    orderSuccess.style.display = 'none';
    checkoutForm.reset();
}

btnGoCheckout.addEventListener('click', function() {
    if (cart.length === 0) return;
    cartContent.style.display = 'none';
    checkoutContent.style.display = 'flex';
    cartTitle.textContent = 'Ödeme';
});

btnBackCart.addEventListener('click', function() {
    resetCheckout();
});

checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    checkoutForm.style.display = 'none';
    orderSuccess.style.display = 'block';
    cart = [];
    updateCart();
    setTimeout(closeCart, 3000);
});

// ============ FAQ ============
document.querySelectorAll('.faq-q').forEach(function(q) {
    q.addEventListener('click', function() {
        var parent = this.parentElement;
        var isActive = parent.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function(item) { item.classList.remove('active'); });
        if (!isActive) parent.classList.add('active');
    });
});

// ============ CONTACT ============
var contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var b = e.target.querySelector('.btn-primary');
        b.textContent = '✓ Gönderildi!'; b.style.background = '#27ae60';
        setTimeout(function() { b.textContent = 'Gönder'; b.style.background = ''; e.target.reset(); }, 2200);
    });
}

// ============ CINEMATIC SCROLL ENGINE (IMAGE SEQUENCE) ============
(function() {
    var canvas = document.getElementById('cinema-canvas');
    if (!canvas) return; // Exit if no canvas (other pages)
    var section = document.querySelector('.cinema-section');
    var fill = document.getElementById('cinema-progress-fill');
    var hint = document.getElementById('cinema-scroll-hint');
    var collection = document.getElementById('collection');
    var texts = [
        document.getElementById('ct1'),
        document.getElementById('ct2'),
        document.getElementById('ct3'),
        document.getElementById('ct4'),
        document.getElementById('ct5')
    ];
    if (!canvas || !section) return;
    
    var ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    
    // Preload frames
    var framesCount = 120;
    var images = [];
    var loaded = 0;
    for (var i = 0; i < framesCount; i++) {
        var img = new Image();
        img.src = 'images/frame_' + i + '.jpg?v=5';
        img.onload = function() {
            loaded++;
            if (loaded === 1 && images[0]) ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
        };
        images.push(img);
    }

    var ranges = [
        [0.00, 0.16],
        [0.19, 0.36],
        [0.39, 0.56],
        [0.59, 0.76],
        [0.80, 1.00]
    ];

    var snapped = false;
    var sTop = 0, sH = 0, vH = 0, scrollable = 0;
    var targetProgress = 0, currentProgress = 0;
    var lastScrollY = window.pageYOffset;
    var velocity = 0;
    var currentFrameIndex = -1;

    // Scroll lock variables for Keşfet (Text 5) section
    var ct5Locked = false;
    var lockEndTime = 0;
    var touchStartY = 0;

    // Wheel event blocking (prevent scroll down while locked)
    window.addEventListener('wheel', function(e) {
        if (!ct5Locked || Date.now() >= lockEndTime) return;
        if (e.deltaY > 0) {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // Touch event blocking (prevent swipe down while locked)
    window.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        if (!ct5Locked || Date.now() >= lockEndTime) return;
        if (e.touches.length > 0) {
            var touchY = e.touches[0].clientY;
            var deltaY = touchStartY - touchY; // positive means scrolling down
            if (deltaY > 0) {
                e.preventDefault();
                return false;
            }
        }
    }, { passive: false });

    // Keyboard event blocking (ArrowDown, PageDown, Space)
    window.addEventListener('keydown', function(e) {
        if (!ct5Locked || Date.now() >= lockEndTime) return;
        var keys = ['ArrowDown', 'PageDown', ' '];
        if (keys.indexOf(e.key) !== -1 || e.keyCode === 32 || e.keyCode === 40 || e.keyCode === 34) {
            e.preventDefault();
            return false;
        }
    });

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
        
        // Calculate velocity for motion blur
        velocity = lerp(velocity, Math.abs(scrollY - lastScrollY), 0.1);
        lastScrollY = scrollY;
        
        // Hard cap scroll position at progress = 0.88 if lock is not yet completed
        var limitY = sTop + scrollable * 0.88;
        var hasFinishedLock = ct5Locked && Date.now() >= lockEndTime;
        if (!hasFinishedLock && scrollY > limitY && scrollY < sTop + sH) {
            scrollY = limitY;
            window.scrollTo(0, limitY);
        }

        // Skip heavy calculations if we are past the cinema section
        if (scrollY > sTop + sH) {
             requestAnimationFrame(update);
             return;
        }

        var scrolled = scrollY - sTop;
        targetProgress = Math.max(0, Math.min(1, scrolled / scrollable));
        
        // Smoothly interpolate progress
        currentProgress = lerp(currentProgress, targetProgress, 0.08);
        if (Math.abs(targetProgress - currentProgress) < 0.001) currentProgress = targetProgress;

        // Trigger lock when entering Keşfet area (range 0.80 to 1.00)
        if (targetProgress >= 0.80 && targetProgress < 0.98 && !ct5Locked) {
            ct5Locked = true;
            lockEndTime = Date.now() + 1200; // 1.2 seconds lock
            window.scrollTo({
                top: sTop + scrollable * 0.88,
                behavior: 'smooth'
            });
        }
        
        // Reset lock if user scrolls back up
        if (targetProgress < 0.75) {
            ct5Locked = false;
            lockEndTime = 0;
        }

        // Draw Sequence to Canvas
        if (loaded > 0) {
            var exactFrame = currentProgress * (framesCount - 1);
            var frameIdx = Math.floor(exactFrame);
            var nextFrameIdx = Math.min(framesCount - 1, Math.ceil(exactFrame));
            var alpha = exactFrame - frameIdx;
            
            // Motion blur effect based on scroll velocity
            var blurAmount = Math.min(8, velocity * 0.05);
            if (blurAmount > 0.5) {
                canvas.style.filter = 'blur(' + blurAmount + 'px)';
            } else {
                canvas.style.filter = 'none';
            }

            // Only draw if frame changed or we need to crossfade
            if (images[frameIdx] && images[frameIdx].complete) {
                ctx.globalAlpha = 1;
                ctx.drawImage(images[frameIdx], 0, 0, canvas.width, canvas.height);
                
                if (alpha > 0.01 && images[nextFrameIdx] && images[nextFrameIdx].complete) {
                    ctx.globalAlpha = alpha;
                    ctx.drawImage(images[nextFrameIdx], 0, 0, canvas.width, canvas.height);
                }
            }
        }

        // Progress bar
        if (fill) fill.style.transform = 'scaleX(' + currentProgress + ')';

        // Scroll hint
        if (hint) hint.style.opacity = currentProgress > 0.02 ? '0' : '1';
        
        // Brand Title Fade
        var brandTitle = document.querySelector('.cinema-brand-title');
        if (brandTitle) {
            var bOp = 1 - (currentProgress / 0.03);
            if (bOp < 0) bOp = 0;
            brandTitle.style.opacity = bOp;
            brandTitle.style.transform = 'translateX(-50%) translateY(' + ((1 - bOp) * -40) + 'px)';
        }

        // Text overlays
        for (var i = 0; i < texts.length; i++) {
            var el = texts[i];
            if (!el) continue;
            var s = ranges[i][0], e = ranges[i][1];
            if (targetProgress >= s && targetProgress <= e) {
                var rp = (targetProgress - s) / (e - s);
                var op = 1;
                if (rp < 0.15) op = rp / 0.15;
                else if (rp > 0.85) op = (1 - rp) / 0.15;
                op = Math.max(0, Math.min(1, op));

                var pos = el.dataset.pos;
                var yOff = (1 - op) * 24;
                if (pos === 'center') {
                    el.style.transform = 'translateX(-50%) translateY(' + yOff + 'px)';
                } else {
                    el.style.transform = 'translateY(' + yOff + 'px)';
                }
                el.style.opacity = op;
                el.classList.add('active');
            } else {
                if (el.classList.contains('active')) {
                    el.style.opacity = '0';
                    var pos2 = el.dataset.pos;
                    if (pos2 === 'center') el.style.transform = 'translateX(-50%) translateY(30px)';
                    else el.style.transform = 'translateY(30px)';
                    el.classList.remove('active');
                }
            }
        }

        // Snap to collection when cinema ends
        if (targetProgress >= 0.99 && !snapped && scrollY < sTop + sH + 100) {
            snapped = true;
            if (collection) collection.scrollIntoView({ behavior: 'smooth' });
        }
        if (targetProgress < 0.95) snapped = false;

        requestAnimationFrame(update);
    }
    
    setTimeout(function() {
        onResize();
        requestAnimationFrame(update);
    }, 100);

    var lastSY = 0;
    window.addEventListener('scroll', function() {
        var sy = window.pageYOffset || document.documentElement.scrollTop;
        
        // Enforce hard cap on scroll event for instant responsiveness
        var limitY = sTop + scrollable * 0.88;
        var hasFinishedLock = ct5Locked && Date.now() >= lockEndTime;
        if (!hasFinishedLock && sy > limitY && sy < sTop + sH) {
            window.scrollTo(0, limitY);
            sy = limitY;
        }

        var cTop = collection ? collection.offsetTop : 0;
        var delta = sy - lastSY;
        if (delta < 0 && sy < cTop + 50 && sy > cTop - window.innerHeight) {
            var cinBot = section.offsetTop + section.offsetHeight - window.innerHeight;
            window.scrollTo({ top: cinBot, behavior: 'smooth' });
        }
        lastSY = sy;
    }, {passive: false});
})();

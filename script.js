/* =============================================
   RONA AUTO GLASS - OTO CAM SHOWCASE V1
   Video sinematik scroll, ürün kataloğu, sepet
============================================= */

// ============ DATA ============
var products = [
    { id:1, name:"Parke Cam", type:"parke", cat:"Parke Cam", price:2500, priceText:"₺2,500", img:"images/p1.png", desc:"Orijinal ekipman kalitesinde parke cam değişimi" },
    { id:2, name:"Dikiz Aynası", type:"dikiz", cat:"Dikiz Aynası", price:1800, priceText:"₺1,800", img:"images/p2.png", desc:"Her marka araç uyumlu dikiz aynası değişimi" },
    { id:3, name:"Arka Cam", type:"arka", cat:"Arka Cam", price:3200, priceText:"₺3,200", img:"images/p3.png", desc:"Arka cam değişimi ve kurulumu" },
    { id:4, name:"Yan Cam", type:"yan", cat:"Yan Cam", price:2200, priceText:"₺2,200", img:"images/p4.png", desc:"Ön ve yan cam değişimi hizmeti" },
    { id:5, name:"Tuning Cam", type:"tuning", cat:"Tuning Cam", price:4500, priceText:"₺4,500", img:"images/p5.png", desc:"Tuning ve estetik cam değişimleri" },
    { id:6, name:"Bandrol Cam", type:"bandrol", cat:"Bandrol Cam", price:1500, priceText:"₺1,500", img:"images/p6.png", desc:"Bandrol ve cam filmi uygulaması" },
    { id:7, name:"Isıyansıtmalı Cam", type:"isiyansitmali", cat:"Isıyansıtmalı Cam", price:3800, priceText:"₺3,800", img:"images/p7.png", desc:"Isıyansıtmalı cam değişimi ve montajı" },
    { id:8, name:"Çatlak Tamiri", type:"tamir", cat:"Çatlak Tamiri", price:800, priceText:"₺800", img:"images/p8.png", desc:"Hızlı ve kalıcı cam çatlak tamiri" },
    { id:9, name:"Ön Cam", type:"on", cat:"Ön Cam", price:5500, priceText:"₺5,500", img:"images/p9.png", desc:"Ön cam değişimi ve ADAS kalibrasyonu" },
    { id:10, name:"Klasik Cam", type:"klasik", cat:"Klasik Cam", price:1900, priceText:"₺1,900", img:"images/p10.png", desc:"Klasik araç cam değişim hizmeti" }
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
var isIndex = document.getElementById('cinema-video') !== null;
var currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-link, .mobile-link').forEach(function(l) {
    var href = l.getAttribute('href');
    if (!href) return;
    var targetPage = href.split('#')[0];
    if (targetPage === '') targetPage = 'index.html';
    if (targetPage === currentPage) {
        if (!isIndex) {
            l.classList.add('active');
        }
    } else {
        l.classList.remove('active');
    }
});

if (!isIndex && navbar) {
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
if (ham && mob) {
    document.querySelectorAll('.mobile-link').forEach(function(l) {
        l.addEventListener('click', function() { ham.classList.remove('active'); mob.classList.remove('open'); });
    });
}

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

// ============ PRODUCT MODAL ============
var pModal = document.getElementById('product-modal'), pModalOverlay = document.getElementById('product-modal-overlay');
var curProduct = null;

function openProductModal(p) {
    if (!pModal) return;
    curProduct = p;
    var modalImg = document.getElementById('modal-img');
    var modalTitle = document.getElementById('modal-title');
    var modalDesc = document.getElementById('modal-desc');
    var modalPrice = document.getElementById('modal-price');
    var modalTryon = document.getElementById('modal-tryon');
    if (modalImg) { modalImg.src = p.img; modalImg.style.display = 'block'; }
    if (modalTitle) modalTitle.textContent = p.name;
    if (modalDesc) modalDesc.textContent = p.desc;
    if (modalPrice) modalPrice.textContent = p.priceText;
    if (modalTryon) modalTryon.style.display = 'none';
    
    pModal.classList.add('open');
    if (pModalOverlay) pModalOverlay.classList.add('open');
}

function closeProductModal() {
    if (!pModal) return;
    pModal.classList.remove('open');
    if (pModalOverlay) pModalOverlay.classList.remove('open');
}

var modalCloseBtn = document.getElementById('modal-close');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
var pModalOverlay = document.getElementById('product-modal-overlay');
if (pModalOverlay) pModalOverlay.addEventListener('click', closeProductModal);

var modalAddCartBtn = document.getElementById('modal-add-cart');
if (modalAddCartBtn) modalAddCartBtn.addEventListener('click', function() {
    if(curProduct) {
        addToCart(curProduct.id);
        closeProductModal();
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
    }
});

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
document.querySelectorAll('.section-header,.about-text,.about-visual,.contact-form,.contact-info').forEach(function(el) {
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
    var cnt = document.getElementById('cart-count');
    var items = document.getElementById('cart-items');
    var tp = document.getElementById('cart-total-price');
    if (!cnt || !items || !tp) return;
    
    var q = cart.reduce(function(s, c) { return s + c.qty; }, 0);
    cnt.textContent = q;
    if (!cart.length) { items.innerHTML = '<p class="cart-empty">Sepetiniz boş</p>'; tp.textContent = '₺0'; return; }
    items.innerHTML = cart.map(function(c) {
        return '<div class="cart-item"><img src="' + c.img + '" alt="' + c.name + '"><div class="cart-item-info"><h4>' + c.name + (c.qty > 1 ? ' (x' + c.qty + ')' : '') + '</h4><p>' + (c.price * c.qty).toLocaleString('tr-TR') + ' ₺</p></div><button class="cart-item-remove" data-id="' + c.id + '">&times;</button></div>';
    }).join('');
    tp.textContent = cart.reduce(function(s, c) { return s + c.price * c.qty; }, 0).toLocaleString('tr-TR') + ' ₺';
    items.querySelectorAll('.cart-item-remove').forEach(function(b) { b.addEventListener('click', function() { removeFromCart(parseInt(b.dataset.id)); }); });
}
var cartBtn = document.getElementById('cart-btn');
var cartSidebar = document.getElementById('cart-sidebar');
var cartOverlay = document.getElementById('cart-overlay');
var cartClose = document.getElementById('cart-close');
if (cartBtn) cartBtn.addEventListener('click', function() { if (cartSidebar) cartSidebar.classList.add('open'); if (cartOverlay) cartOverlay.classList.add('open'); });
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
function closeCart() { 
    if (cartSidebar) cartSidebar.classList.remove('open'); 
    if (cartOverlay) cartOverlay.classList.remove('open'); 
    setTimeout(resetCheckout, 300);
}

// Checkout Logic
var btnGoCheckout = document.getElementById('go-checkout-btn');
var btnBackCart = document.getElementById('back-to-cart-btn');
var cartContent = document.getElementById('cart-content-area');
var checkoutContent = document.getElementById('checkout-content-area');
var cartTitle = document.getElementById('cart-title');
var checkoutForm = document.getElementById('checkout-form');
var orderSuccess = document.getElementById('order-success');

if (btnGoCheckout) btnGoCheckout.addEventListener('click', function() {
    if (cart.length === 0) return;
    if (cartContent) cartContent.style.display = 'none';
    if (checkoutContent) checkoutContent.style.display = 'flex';
    if (cartTitle) cartTitle.textContent = 'Ödeme';
});

if (btnBackCart) btnBackCart.addEventListener('click', function() {
    resetCheckout();
});

if (checkoutForm) checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    checkoutForm.style.display = 'none';
    if (orderSuccess) orderSuccess.style.display = 'block';
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

// ============ IMAGE SEQUENCE CINEMATIC SCROLL ============
(function() {
    var canvas = document.getElementById('cinema-canvas');
    if (!canvas) return;
    var section = document.querySelector('.cinema-section');
    var fill = document.getElementById('cinema-progress-fill');
    var hint = document.getElementById('cinema-scroll-hint');
    var collection = document.getElementById('collection');
    var texts = [
        document.getElementById('ct5')
    ];
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

    var ranges = [
        [0.80, 1.00]
    ];

    var snapped = false;
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

        if (fill) fill.style.transform = 'scaleX(' + currentProgress + ')';

        if (hint) hint.style.opacity = currentProgress > 0.02 ? '0' : '1';
        
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

        var cTop = collection ? collection.offsetTop : 0;
        var delta = sy - lastSY;
        if (delta < 0 && sy < cTop + 50 && sy > cTop - window.innerHeight) {
            var cinBot = section.offsetTop + section.offsetHeight - window.innerHeight;
            window.scrollTo({ top: cinBot, behavior: 'smooth' });
        }
        lastSY = sy;
    }, {passive: false});
})();

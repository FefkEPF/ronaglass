/* =============================================
   RONA AUTO GLASS - PREMIUM SCRIPTS
   Loader, navbar, mobile menu, smooth scroll
   cinematic scroll, counters, FAQ, reveal, form
============================================ */

(function() {
    'use strict';

    // ============ LOADER ============
    window.addEventListener('load', function() {
        var loader = document.getElementById('loader');
        var progress = document.getElementById('loader-progress');
        if (!loader || !progress) return;
        var p = 0;
        var iv = setInterval(function() {
            p += Math.random() * 22 + 5;
            if (p >= 100) { p = 100; clearInterval(iv); }
            progress.style.width = p + '%';
            if (p === 100) setTimeout(function() { loader.classList.add('hidden'); }, 350);
        }, 65);
    });

    // ============ NAVBAR SCROLL & ACTIVE LINK ============
    var navbar = document.getElementById('navbar');

    function updateActiveLink() {
        var secs = document.querySelectorAll('section[id]');
        var links = document.querySelectorAll('.nav-link, .mobile-link');
        var cur = '';
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        secs.forEach(function(s) {
            if (scrollY >= s.offsetTop - 220) cur = s.id;
        });
        if (cur !== '') {
            links.forEach(function(l) {
                var href = l.getAttribute('href');
                if (href && href.includes('#' + cur)) {
                    links.forEach(function(x) { x.classList.remove('active'); });
                    l.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', function() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });

    // ============ HAMBURGER ============
    var ham = document.getElementById('hamburger');
    var mob = document.getElementById('mobile-menu');

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

    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var offsetTop = target.offsetTop - 64;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });
    });

    // ============ REVEAL ON SCROLL ============
    var revealEls = document.querySelectorAll(
        '.about-content, .about-visual, .stat-card, .feature-card, .service-card, ' +
        '.process-step, .adas-card, .fleet-card, .test-card, .faq-item, .blog-card, ' +
        '.contact-form, .contact-card, .section-header, .insurance-text, .logo-item'
    );

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach(function(el, i) {
            el.style.transitionDelay = (i % 4) * 0.06 + 's';
            el.classList.add('reveal');
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function(el) { el.classList.add('visible'); });
    }

    // ============ COUNTER ANIMATION ============
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');
    var countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        var statsSection = document.getElementById('stats');
        if (!statsSection) return;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var offset = statsSection.offsetTop - window.innerHeight + 200;
        if (scrollY < offset) return;
        countersStarted = true;

        statNumbers.forEach(function(el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = 2000;
            var start = performance.now();
            var startVal = 0;

            function update(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(startVal + (target - startVal) * eased);
                el.textContent = current.toLocaleString('tr-TR');
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target.toLocaleString('tr-TR');
            }
            requestAnimationFrame(update);
        });
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // ============ FAQ ACCORDION ============
    document.querySelectorAll('.faq-q').forEach(function(q) {
        q.addEventListener('click', function() {
            var item = q.parentElement;
            var isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('active'); });
            if (!isActive) item.classList.add('active');
        });
    });

    // ============ CONTACT FORM ============
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('name').value.trim();
            var phone = document.getElementById('phone').value.trim();
            if (!name || !phone) {
                alert('Lütfen adınız ve telefon numaranızı girin.');
                return;
            }
            var msg = 'Randevu Talebi\n\n';
            msg += 'Ad: ' + name + '\n';
            msg += 'Telefon: ' + phone + '\n';
            var message = document.getElementById('message').value.trim();
            if (message) msg += 'Mesaj: ' + message + '\n';
            msg += '\nRona Auto Glass ile iletişime geçtiniz.';
            alert('Randevu talebiniz alındı! En kısa sürede size dönüş yapacağız.\n\nTel: 0534 694 37 89');
            contactForm.reset();
        });
    }

    // ============ CINEMATIC IMAGE SEQUENCE ============
    (function() {
        var canvas = document.getElementById('cinema-canvas');
        var section = document.querySelector('.cinema-section');
        var fill = document.getElementById('cinema-progress-fill');
        var hint = document.getElementById('cinema-scroll-hint');
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

    })();

    // ============ MODALS ============
    document.querySelectorAll('.privacy-trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('data-target');
            var modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.querySelectorAll('.modal-close').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var overlay = this.closest('.modal-overlay');
            if (overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(function(overlay) {
                overlay.classList.remove('open');
            });
            document.body.style.overflow = '';
        }
    });

})();

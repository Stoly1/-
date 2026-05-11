/* ===== Letter-by-letter reveal for hero names ===== */
(function () {
    const targets = document.querySelectorAll('[data-split]');
    let totalDelay = 600; // start after invite-label fade
    targets.forEach((el, ti) => {
        const text = el.textContent;
        el.textContent = '';
        [...text].forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch === ' ' ? ' ' : ch;
            span.style.animationDelay = (totalDelay + i * 60) + 'ms';
            el.appendChild(span);
        });
        totalDelay += text.length * 60 + 200;
    });
})();

/* ===== Countdown ===== */
(function () {
    const target = new Date('2026-08-22T15:30:00+03:00').getTime();
    const elD = document.getElementById('cdDays');
    const elH = document.getElementById('cdHours');
    const elM = document.getElementById('cdMin');
    const elS = document.getElementById('cdSec');
    if (!elD) return;
    const pad = n => String(Math.max(0, n)).padStart(2, '0');
    function tick() {
        const now = Date.now();
        let diff = Math.max(0, target - now);
        const days = Math.floor(diff / 86400000); diff -= days * 86400000;
        const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
        const mins = Math.floor(diff / 60000); diff -= mins * 60000;
        const secs = Math.floor(diff / 1000);
        elD.textContent = pad(days);
        elH.textContent = pad(hours);
        elM.textContent = pad(mins);
        elS.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
})();

/* ===== Reveal on scroll ===== */
(function () {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    items.forEach(el => io.observe(el));
})();

/* ===== Cursor glow follower (lerp) ===== */
(function () {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (reduceMotion || isTouch) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let visible = false;

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!visible) {
            visible = true;
            glow.style.opacity = '1';
        }
    });
    window.addEventListener('mouseleave', () => {
        visible = false;
        glow.style.opacity = '0';
    });

    function frame() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        requestAnimationFrame(frame);
    }
    frame();
})();

/* ===== Subtle parallax on hero corners ===== */
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const corners = document.querySelectorAll('.hero-corner');
    if (!corners.length) return;
    let mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    function frame() {
        corners.forEach((c, i) => {
            const intensity = 6 + (i * 2);
            c.style.transform = `translate(${mx * intensity}px, ${my * intensity}px)`;
        });
        requestAnimationFrame(frame);
    }
    frame();
})();

/* ===== Magnetic effect for map links ===== */
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (reduceMotion || isTouch) return;

    document.querySelectorAll('.map-link').forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
})();

/* ===== Fireworks: rockets bursting above "Свадьба" ===== */
(function () {
    const canvas = document.getElementById('fireworks');
    const word = document.getElementById('inviteWord');
    const hero = document.querySelector('.hero');
    if (!canvas || !word || !hero) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let W = 0, H = 0;
    let emitX = 0, emitY = 0, emitWidth = 0;

    function resize() {
        const rect = hero.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        updateEmissionPoint();
    }
    function updateEmissionPoint() {
        const wRect = word.getBoundingClientRect();
        const hRect = hero.getBoundingClientRect();
        emitX = wRect.left - hRect.left + wRect.width / 2;
        emitY = wRect.top - hRect.top;
        emitWidth = wRect.width;
    }

    resize();
    window.addEventListener('resize', resize);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateEmissionPoint);
    }
    setTimeout(updateEmissionPoint, 800);
    setTimeout(updateEmissionPoint, 2200);

    // Pink / lavender / coral / cream / white tones
    const COLORS = [
        { h: 330, s: 88, l: 72 }, // pink
        { h: 305, s: 75, l: 75 }, // pink-lavender
        { h: 280, s: 70, l: 70 }, // lavender
        { h: 345, s: 85, l: 76 }, // coral
        { h: 315, s: 80, l: 80 }, // soft pink
        { h: 50,  s: 90, l: 82 }, // cream gold
        { h: 0,   s: 0,  l: 100 }, // white
    ];

    const rockets = [];
    const sparks = [];
    const MAX_SPARKS = 800;

    function spawnRocket() {
        const c = COLORS[Math.floor(Math.random() * COLORS.length)];
        const burstY = 30 + Math.random() * 90;
        const driftX = (Math.random() - 0.5) * 1.2;
        rockets.push({
            x: emitX + (Math.random() - 0.5) * (emitWidth * 0.7),
            y: emitY,
            vx: driftX,
            vy: -7.5 - Math.random() * 2.5,
            burstY,
            color: c,
            trail: [],
        });
    }

    function burst(r) {
        const count = 28 + Math.floor(Math.random() * 22);
        const baseSpeed = 1.4 + Math.random() * 1.6;
        // Slight color variation within the burst
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.18;
            const speed = baseSpeed * (0.6 + Math.random() * 0.8);
            const c = {
                h: r.color.h + (Math.random() - 0.5) * 14,
                s: r.color.s,
                l: r.color.l + (Math.random() - 0.5) * 8,
            };
            sparks.push({
                x: r.x,
                y: r.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.4,
                life: 1,
                decay: 0.005 + Math.random() * 0.011,
                size: 0.9 + Math.random() * 1.4,
                color: c,
                twinkle: Math.random() * Math.PI * 2,
            });
            if (sparks.length > MAX_SPARKS) sparks.shift();
        }
    }

    let running = true;
    document.addEventListener('visibilitychange', () => running = !document.hidden);

    let frame = 0;
    let nextSpawn = 30;
    function tick() {
        if (!running) { requestAnimationFrame(tick); return; }
        frame++;

        // Soft trail erase
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';

        // Spawn rockets in waves
        if (frame >= nextSpawn) {
            spawnRocket();
            if (Math.random() < 0.35) {
                setTimeout(() => { if (running) spawnRocket(); }, 180);
            }
            nextSpawn = frame + 75 + Math.floor(Math.random() * 90);
        }

        // Rockets
        for (let i = rockets.length - 1; i >= 0; i--) {
            const r = rockets[i];
            r.x += r.vx;
            r.y += r.vy;
            r.vy += 0.04;
            r.trail.push({ x: r.x, y: r.y });
            if (r.trail.length > 10) r.trail.shift();

            for (let j = 0; j < r.trail.length; j++) {
                const t = r.trail[j];
                const a = (j / r.trail.length) * 0.55;
                ctx.fillStyle = `hsla(${r.color.h}, ${r.color.s}%, ${r.color.l + 10}%, ${a})`;
                ctx.beginPath();
                ctx.arc(t.x, t.y, 1.4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Rocket head
            ctx.fillStyle = `hsla(${r.color.h}, ${r.color.s}%, 92%, 0.95)`;
            ctx.beginPath();
            ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
            ctx.fill();

            if (r.y <= r.burstY) {
                burst(r);
                rockets.splice(i, 1);
            }
        }

        // Sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.045;
            s.vx *= 0.985;
            s.vy *= 0.985;
            s.life -= s.decay;
            s.twinkle += 0.45;

            if (s.life <= 0 || s.y > H + 30 || s.x < -30 || s.x > W + 30) {
                sparks.splice(i, 1);
                continue;
            }

            const alpha = s.life;
            const flicker = 0.7 + 0.3 * Math.sin(s.twinkle);

            // Glow
            const gs = s.size * 5.5;
            const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gs);
            grad.addColorStop(0, `hsla(${s.color.h}, ${s.color.s}%, ${s.color.l + 12}%, ${alpha * 0.6 * flicker})`);
            grad.addColorStop(0.5, `hsla(${s.color.h}, ${s.color.s}%, ${s.color.l}%, ${alpha * 0.2 * flicker})`);
            grad.addColorStop(1, `hsla(${s.color.h}, ${s.color.s}%, ${s.color.l}%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(s.x, s.y, gs, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = `hsla(${s.color.h}, 70%, 94%, ${alpha * flicker})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();

/* ===== Smooth scroll polyfill for nav ===== */
(function () {
    document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();

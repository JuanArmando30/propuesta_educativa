/* Conectados para aprender — comportamiento de la página
   Las animaciones principales las hacen librerías externas:
   AOS · Animate.css · GSAP + ScrollTrigger · Typed.js · tsParticles · Vanilla Tilt · canvas-confetti */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. AOS: aparición al hacer scroll ---------- */
  if (window.AOS) {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60, disable: reduce });
  } else {
    root.classList.add('no-aos');          // si la librería no cargó, se muestra todo igual
  }

  /* ---------- 2. Typed.js: texto que se escribe solo ---------- */
  const phrases = [
    'buscar información confiable',
    'pensar con sentido crítico',
    'crear contenidos con creatividad',
    'resolver problemas reales',
    'decidir con responsabilidad',
    'participar con o sin internet'
  ];
  if (window.Typed && !reduce && $('#typed')) {
    new Typed('#typed', { strings: phrases, typeSpeed: 42, backSpeed: 22, backDelay: 1700, startDelay: 900, loop: true });
  }

  /* ---------- 3. tsParticles: red de puntos conectados ---------- */
  if (window.tsParticles && !reduce && $('#tsparticles')) {
    tsParticles.load({
      id: 'tsparticles',
      options: {
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: { value: 55, density: { enable: true, width: 900, height: 900 } },
          color: { value: ['#14D3A0', '#FFC93C', '#8F7CFF', '#FF8A7A', '#3EB6FF'] },
          links: { enable: true, distance: 140, color: '#8F7CFF', opacity: 0.4, width: 1.2 },
          move: { enable: true, speed: 0.9, outModes: { default: 'bounce' } },
          opacity: { value: { min: 0.5, max: 0.9 } },
          size: { value: { min: 2, max: 4.5 } }
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'grab' }, onClick: { enable: true, mode: 'push' } },
          modes: { grab: { distance: 170, links: { opacity: 0.8 } }, push: { quantity: 3 } }
        }
      }
    }).catch(() => {});
  }

  /* ---------- 4. GSAP: hero, contadores, ruta, praxis, parallax ---------- */
  const routeItems = $$('.route-item');
  if (hasGsap && !reduce) {
    // Entrada del mockup y flotado de los iconos
    gsap.from('.device', { y: 70, opacity: 0, rotate: 4, duration: 1.1, ease: 'back.out(1.4)', delay: 0.35 });
    gsap.from('.float-chip', { scale: 0, rotation: -40, duration: 0.8, ease: 'back.out(2.2)', stagger: 0.12, delay: 0.9 });
    $$('.float-chip').forEach((chip, i) => {
      gsap.to(chip, { y: i % 2 ? -16 : 16, rotation: i % 2 ? 7 : -7, duration: 2.2 + i * 0.35, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 });
    });
    // Subrayado dibujado a mano
    gsap.fromTo('.hl-line path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, delay: 1, ease: 'power2.inOut' });

    // Parallax suave del mockup con el mouse
    const hero = $('#inicio');
    if (finePointer && hero) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to('.device', { rotationY: x * 14, rotationX: -y * 10, duration: 0.9, ease: 'power3.out' });
        $$('.float-chip').forEach((chip, i) => gsap.to(chip, { x: x * (i % 2 ? -34 : 34), duration: 1.1, ease: 'power3.out' }));
      });
    }

    // Contadores
    $$('.count').forEach((el) => {
      const to = Number(el.dataset.to) || 0;
      const o = { v: 0 };
      el.textContent = '0';
      ScrollTrigger.create({
        trigger: el, start: 'top 95%', once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); } })
      });
    });

    // Ruta de actividades: la línea se va "dibujando" al bajar
    const route = $('.route');
    if (route) {
      gsap.fromTo('.route-line i', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: route, start: 'top 60%', end: 'bottom 75%', scrub: 0.5 }
      });
      routeItems.forEach((it) => ScrollTrigger.create({
        trigger: it, start: 'top 62%',
        onEnter: () => it.classList.add('on'),
        onLeaveBack: () => it.classList.remove('on')
      }));
    }

    // Ciclo de la praxis
    if ($('#praxis')) {
      gsap.fromTo('#praxisRing', { strokeDasharray: 1, strokeDashoffset: 1 }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: '#praxis', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 }
      });
      gsap.from('.praxis-node', {
        scale: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.35,
        scrollTrigger: { trigger: '#praxis', start: 'top 75%', toggleActions: 'play none none none' }
      });
      gsap.to('.praxis-orbit', { rotation: 360, duration: 50, repeat: -1, ease: 'none' });
    }

    // Parallax de los círculos de fondo
    $$('[data-parallax]').forEach((el) => {
      gsap.to(el, { yPercent: Number(el.dataset.parallax), ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Recalcular posiciones cuando cambian las alturas
    const refresh = () => { ScrollTrigger.refresh(); if (window.AOS) AOS.refresh(); };
    document.addEventListener('shown.bs.collapse', refresh);
    document.addEventListener('hidden.bs.collapse', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
  } else {
    // Sin GSAP o con "menos movimiento": se muestra el estado final
    routeItems.forEach((it) => it.classList.add('on'));
    const fill = $('.route-line i'); if (fill) fill.style.transform = 'scaleY(1)';
    const ring = $('#praxisRing'); if (ring) { ring.style.strokeDasharray = '1'; ring.style.strokeDashoffset = '0'; }
  }

  /* ---------- 5. Vanilla Tilt: tarjetas de recursos con relieve ---------- */
  if (window.VanillaTilt && finePointer && !reduce) {
    VanillaTilt.init($$('.tilt'), { max: 9, speed: 500, glare: true, 'max-glare': 0.25, scale: 1.02 });
  }

  /* ---------- 6. Barra de progreso de lectura ---------- */
  const bar = $('#progress');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = root.scrollHeight - root.clientHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(root.scrollTop / h, 1) : 0})`;
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 7. Menú y enlaces internos: desplazamiento fiable ----------
     El menú móvil se pliega mientras se baja y cambia la altura de la barra; por eso el
     navegador se quedaba corto. Aquí se mide la barra ya cerrada y se recalcula el destino
     en cada cuadro, hasta llegar exacto a la sección. */
  const nav = $('#mainNav');
  const menu = $('#navMenu');
  let navClosedH = nav.offsetHeight;
  const measureNav = () => { if (!menu.classList.contains('show') && !menu.classList.contains('collapsing')) navClosedH = nav.offsetHeight; };
  window.addEventListener('resize', measureNav);
  let scrollJob = 0;
  const stopScroll = () => { if (scrollJob) { cancelAnimationFrame(scrollJob); scrollJob = 0; root.style.scrollBehavior = ''; } };
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((ev) => window.addEventListener(ev, stopScroll, { passive: true }));

  function scrollToSection(el) {
    stopScroll();
    const targetY = () => Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - navClosedH + 1));
    if (reduce) { window.scrollTo(0, targetY()); return; }
    root.style.scrollBehavior = 'auto';               // evita que el CSS "suave" pelee con la animación
    const startY = window.scrollY;
    const t0 = performance.now();
    const dur = Math.min(1100, 450 + Math.abs(targetY() - startY) * 0.12);
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      const y = targetY();                             // se recalcula por si la página cambió de altura
      window.scrollTo(0, startY + (y - startY) * ease(t));
      if (t < 1) { scrollJob = requestAnimationFrame(step); return; }
      window.scrollTo(0, targetY());                   // ajuste final exacto
      // por si las imágenes o animaciones movieron algo al terminar, se corrige una vez más
      setTimeout(() => { if (!scrollJob && Math.abs(el.getBoundingClientRect().top - (navClosedH - 1)) > 3) window.scrollTo(0, targetY()); }, 350);
      scrollJob = 0; root.style.scrollBehavior = '';
    };
    scrollJob = requestAnimationFrame(step);
  }

  $$('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    a.addEventListener('click', (e) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (menu.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(menu).hide();
      scrollToSection(el);
      history.replaceState(null, '', `#${id}`);
    });
  });
  // si la página se abre con un # en la dirección, se llega igual de bien
  if (location.hash.length > 1) {
    const first = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (first) window.addEventListener('load', () => setTimeout(() => scrollToSection(first), 300));
  }

  /* Resaltar en el menú la sección que se está viendo */
  const spyLinks = $$('#navMenu .nav-link');
  const spyMap = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const setActive = (id) => spyLinks.forEach((a) => {
    const on = a === spyMap.get(id);
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    [...spyMap.keys(), 'difusion'].forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
    const hero = $('#inicio'); // arriba del todo no se resalta nada
    if (hero) new IntersectionObserver((en) => { if (en[0].isIntersecting) setActive(null); }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  /* ---------- 8. Resultados: punto de partida ↔ lo que se busca ---------- */
  const shiftCard = $('.shift-card');
  const shiftItems = $$('#shiftList li');
  function renderShift(mode, animate) {
    shiftCard.classList.toggle('after', mode === 'b');
    shiftItems.forEach((li, i) => {
      $('span', li).textContent = li.dataset[mode];
      if (animate && !reduce) {
        li.classList.remove('animate__animated', 'animate__fadeInUp');
        void li.offsetWidth;                                   // reinicia la animación de Animate.css
        li.style.setProperty('--animate-duration', '.5s');
        li.style.animationDelay = `${i * 90}ms`;
        li.classList.add('animate__animated', 'animate__fadeInUp');
      }
    });
  }
  if (shiftCard) {
    renderShift('a', false);
    $$('input[name="shift"]').forEach((r) => r.addEventListener('change', () => renderShift(r.id === 'shiftB' ? 'b' : 'a', true)));
  }

  /* ---------- 9. Lista de cotejo interactiva ---------- */
  const checks = $$('.ck input');
  const ckRing = $('#ckRing');
  const ckCount = $('#ckCount');
  const ckMsg = $('#ckMsg');
  const ckDefault = ckMsg ? ckMsg.textContent : '';
  const ckMessages = [
    ckDefault,
    '¡Buen comienzo! Ya hay avances que se pueden reconocer.',
    '¡Va tomando forma!',
    'Más de la mitad del camino.',
    'Casi lo logra, ¡sigue así!',
  ];
  let celebrated = false;
  function updateChecklist() {
    const done = checks.filter((c) => c.checked).length;
    const total = checks.length;
    ckCount.textContent = `${done}/${total}`;
    const off = 1 - done / total;
    if (hasGsap && !reduce) gsap.to(ckRing, { strokeDashoffset: off, duration: 0.6, ease: 'power2.out' });
    else ckRing.style.strokeDashoffset = off;
    if (done === total) {
      ckMsg.textContent = '¡Todos los indicadores logrados! Así se ven los avances de una estrategia completa.';
      if (!celebrated && window.confetti && !reduce) {
        celebrated = true;
        const colors = ['#FFC93C', '#14D3A0', '#FF5E4D', '#8F7CFF', '#3EB6FF'];
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 }, colors });
        setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }), 250);
        setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }), 250);
      }
    } else {
      celebrated = false;
      ckMsg.textContent = ckMessages[Math.min(Math.floor((done / total) * 5), 4)] || ckDefault;
    }
  }
  checks.forEach((c) => c.addEventListener('change', updateChecklist));
  const reset = $('#ckReset');
  if (reset) reset.addEventListener('click', () => { checks.forEach((c) => { c.checked = false; }); updateChecklist(); });
  if (ckRing) updateChecklist();

  /* ---------- 10. Difusión: textos, enlace, redes, QR e imágenes ---------- */
  const url = /^https?:$/.test(location.protocol) ? location.href.split('#')[0] : '';
  const urlInput = $('#shareUrl');
  const textArea = $('#shareText');
  const tag = '#ConectadosParaAprender';
  const posts = [
    `Conectados para aprender: una propuesta para usar la tecnología con propósito y responsabilidad, para estudiar, investigar, crear y resolver problemas de nuestro entorno. ${tag}`,
    `Antes de compartir, verifica: ¿quién lo publica?, ¿qué datos presenta?, ¿coincide con otras fuentes confiables? Así aprendemos a usar internet con responsabilidad. ${tag}`,
    `Buscar, decidir, crear y compartir: seis actividades para que los estudiantes usen la tecnología con propósito educativo. Conoce la propuesta. ${tag}`,
    `La verdadera innovación no está en los dispositivos, sino en cómo los usamos. Cada actividad tiene una versión sin internet para que nadie se quede fuera. ${tag}`
  ];

  if (urlInput) {
    urlInput.value = url || 'El enlace aparecerá aquí cuando publiques la página';
    if (!url) $('#urlHint').hidden = false;
  }

  function updateShareLinks() {
    const msg = textArea.value.trim();
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(msg);
    const full = encodeURIComponent(`${msg} ${url}`.trim());
    $('#sh-wa').href = `https://wa.me/?text=${full}`;
    $('#sh-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`;
    $('#sh-x').href = `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
    $('#sh-tg').href = `https://t.me/share/url?url=${u}&text=${t}`;
    $('#sh-in').href = `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    $('#sh-mail').href = `mailto:?subject=${encodeURIComponent('Conectados para aprender')}&body=${full}`;
  }

  const carouselEl = $('#cardsCarousel');
  const postBtns = $$('[data-post]');
  function setPost(i) {
    textArea.value = posts[i];
    postBtns.forEach((b) => b.classList.toggle('active', Number(b.dataset.post) === i));
    updateShareLinks();
  }
  postBtns.forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.post);
    setPost(i);
    if (window.bootstrap) bootstrap.Carousel.getOrCreateInstance(carouselEl).to(i);
  }));
  if (carouselEl) carouselEl.addEventListener('slid.bs.carousel', (e) => setPost(e.to));
  textArea.addEventListener('input', updateShareLinks);
  setPost(0);

  // Aviso (toast)
  function toast(msg) {
    $('#toastMsg').textContent = msg;
    if (window.bootstrap) bootstrap.Toast.getOrCreateInstance($('#copyToast'), { delay: 2200 }).show();
  }

  // Copiar enlace
  $('#copyBtn').addEventListener('click', async () => {
    if (!url) { toast('Primero publica la página para tener un enlace real'); return; }
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {
      urlInput.select();
      document.execCommand('copy');
    }
    toast('¡Enlace copiado!');
  });

  // Compartir con el menú del celular, si existe
  const nativeBtn = $('#shNative');
  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', () => {
      navigator.share({ title: 'Conectados para aprender', text: textArea.value.trim(), url: url || undefined }).catch(() => {});
    });
  }

  // Código QR
  const qrBox = $('#qr');
  if (url && typeof window.qrcode === 'function') {
    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch (_) { /* si el enlace es muy largo, no se dibuja */ }
  }

  // Las tarjetas se escalan según su ancho (así se ven igual en celular y al descargarlas)
  const cards = $$('.scard');
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((en) => {
      const w = en.contentRect.width;
      if (w > 0) en.target.style.setProperty('--u', `${w / 54}px`);
    }));
    cards.forEach((c) => ro.observe(c));
  }

  // Descargar la imagen visible como PNG (1080 × 1080)
  const dl = $('#dlCard');
  dl.addEventListener('click', async () => {
    if (!window.html2canvas) { toast('No se pudo cargar el generador de imágenes'); return; }
    const active = $('.carousel-item.active .scard');
    const index = $$('.carousel-item').findIndex((i) => i.classList.contains('active')) + 1;
    const holder = document.createElement('div');
    holder.style.cssText = 'position:fixed;left:-10000px;top:0;width:1080px;height:1080px;pointer-events:none';
    const clone = active.cloneNode(true);
    clone.style.cssText = 'width:1080px;height:1080px;--u:20px;box-shadow:none';
    holder.appendChild(clone);
    document.body.appendChild(holder);
    // html2canvas necesita tamaño explícito en los SVG
    $$('svg', clone).forEach((s) => {
      const r = s.getBoundingClientRect();
      s.setAttribute('width', Math.round(r.width));
      s.setAttribute('height', Math.round(r.height));
    });
    dl.disabled = true;
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const canvas = await html2canvas(clone, { backgroundColor: null, scale: 1, useCORS: true, logging: false });
      const a = document.createElement('a');
      a.download = `conectados-para-aprender-${index}.png`;
      a.href = canvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('¡Imagen descargada!');
    } catch (err) {
      toast('No se pudo crear la imagen. Intenta de nuevo.');
    } finally {
      holder.remove();
      dl.disabled = false;
    }
  });
})();

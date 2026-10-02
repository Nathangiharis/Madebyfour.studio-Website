document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1) Mobile Menu & Hamburger Interactivity
  // =========================================================================
  const burgerBtn = document.querySelector('.mobile-burger');
  const overlay = document.getElementById('mobile-overlay');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-signin-btn');

  function openMenu() {
    if (!burgerBtn || !mobileMenu || !overlay) return;
    burgerBtn.setAttribute('aria-expanded', 'true');
    overlay.removeAttribute('hidden');
    mobileMenu.removeAttribute('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!burgerBtn || !mobileMenu || !overlay) return;
    burgerBtn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('hidden', '');
    mobileMenu.setAttribute('hidden', '');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    const isExpanded = burgerBtn?.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // =========================================================================
  // 2) Stats Count-Up Animation (easeOutCubic) - 3 Metrics
  // =========================================================================
  const statItems = document.querySelectorAll('.stat-item');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(item, index) {
    const target = parseFloat(item.getAttribute('data-target') || '0');
    const decimals = parseInt(item.getAttribute('data-decimals') || '0', 10);
    const numberEl = item.querySelector('.stat-number');

    if (!numberEl) return;

    const duration = 1400 + index * 90;
    const startOffset = 450 + index * 100;

    setTimeout(() => {
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = easedProgress * target;

        numberEl.textContent = currentValue.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          numberEl.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(step);
    }, startOffset);
  }

  let statsAnimated = false;

  function initStatsAnimation() {
    if (statsAnimated) return;
    statsAnimated = true;
    statItems.forEach((item, index) => {
      animateStat(item, index);
    });
  }

  const statsFooter = document.querySelector('.stats-footer');

  if (statsFooter && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initStatsAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(statsFooter);
  } else {
    setTimeout(initStatsAnimation, 400);
  }

  // =========================================================================
  // 3) Interactive 5-Card Service Deck Switcher (Image 3 Reference)
  // =========================================================================
  const servicePills = document.querySelectorAll('.srv-pill-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  servicePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetIndex = pill.getAttribute('data-index');

      // Update Active Pill
      servicePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      // Keep the selected tab visible when the tab row scrolls on phones
      const pillRow = pill.parentElement;
      if (pillRow && pillRow.scrollWidth > pillRow.clientWidth) {
        pillRow.scrollTo({
          left: pill.offsetLeft - (pillRow.clientWidth - pill.offsetWidth) / 2,
          behavior: 'smooth'
        });
      }

      // Update Active Card
      serviceCards.forEach((card, idx) => {
        if (idx.toString() === targetIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });
  });

  // =========================================================================
  // 4) Scroll Reveal Animation (Row by Row Pop-up on Scroll)
  // =========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Keep observing or unobserve once revealed
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not available
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // =========================================================================
  // 5) Video Autoplay Resilience
  // =========================================================================
  const video = document.querySelector('.bg-video');
  if (video) {
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }
});

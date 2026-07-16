// ─── Loader ────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('bg-loader');
    const cube = document.querySelector('.cube-loader');

    if (loader && cube) {
        setTimeout(() => {
            cube.classList.add('blast');
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => { loader.style.display = 'none'; }, 500);
            }, 800);
        }, 2500);
    }
});

// ─── Fade-in on scroll ─────────────────────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .experience-card, .projects-card, .skills-card')
    .forEach(el => fadeObserver.observe(el));



// ─── 1. Typing animation ───────────────────────────────────────────────────
const roles = [
    'AI Engineer',
    'Machine Learning Engineer',
    'Software Engineer',
    'Agentic AI Developer',
    'Digital Twin Builder',
];
const typingEl = document.querySelector('.main-card h2');

if (typingEl) {
    typingEl.innerHTML = '<span id="typed-text"></span><span class="cursor-blink">|</span>';
    const typedText = document.getElementById('typed-text');
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const current = roles[roleIndex];
        if (isDeleting) {
            typedText.textContent = current.substring(0, charIndex--);
        } else {
            typedText.textContent = current.substring(0, charIndex++);
        }

        let delay = isDeleting ? 45 : 85;

        if (!isDeleting && charIndex > current.length) {
            isDeleting = true;
            delay = 1800; // pause before deleting
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }
        setTimeout(type, delay);
    }
    setTimeout(type, 1200);
}

// ─── 2. Mouse spotlight — full page ───────────────────────────────────────
document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--spotlight-x', `${e.clientX}px`);
    document.body.style.setProperty('--spotlight-y', `${e.clientY}px`);
});

// ─── 3. 3D card tilt on hover ──────────────────────────────────────────────
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
    });
});

// ─── 4. Scroll progress bar ────────────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

const infoContainer = document.querySelector('.info-container');
if (infoContainer) {
    infoContainer.addEventListener('scroll', updateProgress);
}
window.addEventListener('scroll', updateProgress);

function updateProgress() {
    const scrollTarget = infoContainer || document.documentElement;
    const scrollTop = scrollTarget.scrollTop || window.scrollY;
    const scrollHeight = scrollTarget.scrollHeight - scrollTarget.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
}

// ─── 5. Copy email to clipboard with toast ─────────────────────────────────
const emailLink = document.getElementById('contact-email-link');
if (emailLink) {
    const toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.textContent = '✓ Email copied to clipboard!';
    document.body.appendChild(toast);

    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('praveenpravee406@gmail.com').then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        });
    });
}

// ─── 6. Click Nav Menu — Time Travel Scroll ────────────────────────────────
function scrollToSection(targetId) {
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    // Trigger WebGL Time Travel Warp Speed
    if (typeof window.triggerTimeTravel === 'function') {
        window.triggerTimeTravel(1400);
    }

    const infoContainer = document.querySelector('.info-container');
    const isContainerScrollable = infoContainer &&
        (window.getComputedStyle(infoContainer).overflowY === 'auto' ||
         window.getComputedStyle(infoContainer).overflowY === 'scroll');

    if (isContainerScrollable) {
        infoContainer.scrollTo({ top: targetEl.offsetTop - 30, behavior: 'smooth' });
    } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
    }
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            scrollToSection(targetId);
        }
    });
});

// ─── 7. Hamburger / Mobile Nav ─────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav    = document.getElementById('mobile-nav');

function openMobileNav() {
    hamburgerBtn.classList.add('open');
    mobileNav.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMobileNav() {
    hamburgerBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        isOpen ? closeMobileNav() : openMobileNav();
    });

    // Close overlay when any mobile link is clicked and scroll to section
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                closeMobileNav();
                // Small delay so overlay closes before scroll
                setTimeout(() => scrollToSection(targetId), 150);
            }
        });
    });

    // Close overlay on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMobileNav();
    });
}

// ─── 8. Sync mobile nav active state with scroll-spy + Wormhole on section change ──
let sectionObserverReady = false; // skip wormhole on initial page load
setTimeout(() => { sectionObserverReady = true; }, 500);

const allNavObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;

            // Desktop nav
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            const desktopLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (desktopLink) desktopLink.classList.add('active');

            // Mobile nav
            document.querySelectorAll('.mobile-nav-link').forEach(a => a.classList.remove('active'));
            const mobileLink = document.querySelector(`.mobile-nav-link[href="#${id}"]`);
            if (mobileLink) mobileLink.classList.add('active');

            // Fire wormhole when a new section enters (skip on initial page load)
            if (sectionObserverReady && typeof window.triggerTimeTravel === 'function') {
                window.triggerTimeTravel(900);
            }
        }
    });
}, {
    rootMargin: '-30% 0px -69% 0px',
    threshold: 0
});

['about', 'experience', 'projects', 'skills', 'education', 'contact'].forEach(id => {
    const section = document.getElementById(id);
    if (section) allNavObserver.observe(section);
});

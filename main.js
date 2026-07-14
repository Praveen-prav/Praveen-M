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

// ─── Active nav on scroll ──────────────────────────────────────────────────
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            const link = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
            if (link) link.classList.add('active');
        }
    });
}, { threshold: 0.4 });

['about', 'experience', 'projects', 'skills', 'education', 'contact'].forEach(id => {
    const section = document.getElementById(id);
    if (section) navObserver.observe(section);
});

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

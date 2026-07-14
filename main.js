// Fade-out loader with smooth light blast
window.addEventListener('load', () => {
    const loader = document.getElementById('bg-loader');
    const cube = document.querySelector('.cube-loader');
    
    if (loader && cube) {
        // Wait for the zoomSpin animation to near completion
        setTimeout(() => {
            cube.classList.add('blast'); // Triggers the Light Blast
            
            // Wait for blast animation (0.8s) to finish for smoothness
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 800);
        }, 2500); 
    }
});

// Fade-in animation
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".fade-in, .experience-card, .projects-card, .skills-card")
  .forEach(el => fadeObserver.observe(el));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-menu a").forEach(a => a.classList.remove("active"));
        const id = entry.target.id;
        const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
        if (link) link.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);

["about", "experience", "projects", "skills", "contact"].forEach(id => {
  const section = document.getElementById(id);
  if (section) navObserver.observe(section);
});

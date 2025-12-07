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

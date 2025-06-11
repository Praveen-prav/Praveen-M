const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible')
        }
    })
}, {
    threshold : 0.1
})


document.querySelectorAll('.fade-in').forEach((section) =>{
    observer.observe(section)
})

document.querySelectorAll('.experience-card').forEach((section) =>{
    observer.observe(section)
})

document.querySelectorAll('.projects-card').forEach((section) =>{
    observer.observe(section)
})

document.querySelectorAll('.skills-card').forEach((section) =>{
    observer.observe(section)
})
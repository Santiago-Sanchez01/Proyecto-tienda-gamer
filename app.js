// Slideshow automático del hero ESTO NO LO SE USAR!!!
  const slides = document.querySelectorAll('.hero-slide');
  let current = 0;

  function nextSlide() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }

  // Cambia de imagen cada 5 segundos
  setInterval(nextSlide, 5000);

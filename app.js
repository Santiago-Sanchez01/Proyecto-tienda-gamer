 // Slideshow automático del hero ESTO NO LO SE USAR!!!
  const slides = document.querySelectorAll('.hero-slide');
  let current = 0;

  function nextSlide() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }

  // Cambia de imagen cada 5 segundos
  setInterval (nextSlide, 5000);




// ===== CARRITO =====
const botonesAgregar = document.querySelectorAll('.boton-agregar');
const contadorCarrito = document.getElementById('contador-carrito');

let cantidadCarrito = 0; // Arranca en 0

// Recorremos todos los botones "Agregar al carrito"
botonesAgregar.forEach(function(boton) {
  boton.addEventListener('click', function() {
    // Aumentamos la cantidad
    cantidadCarrito += 1;

    // Actualizamos el número que se ve en el header
    contadorCarrito.textContent = cantidadCarrito;

    // Feedback visual (opcional pero queda bueno)
    boton.textContent = '✓ Agregado';
    boton.style.backgroundColor = '#4CAF50';
    boton.style.color = 'white';

    // Después de 1.2 segundos vuelve al texto original
    setTimeout(function() {
      boton.textContent = 'Agregar al carrito';
      boton.style.backgroundColor = '';
      boton.style.color = '';
    }, 1200);
  });
});
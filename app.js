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




// ===== PRODUCTOS =====
const productos = [
  {
    "id": "joystick-ps5",
    "nombre": "Joystick PS5",
    "precio": 150000,
    "imagen": "imagenes/dualsense.jpg"
  },
  {
    "id": "headset-gamer",
    "nombre": "Headset Gamer",
    "precio": 85000,
    "imagen": "imagenes/headset.jpg"
  },
  {
    "id": "joystick-xbox",
    "nombre": "Joystick Xbox",
    "precio": 120000,
    "imagen": "imagenes/Joystick-xbox.jpg"
  },
  {
    "id": "playstation-5",
    "nombre": "Playstation 5",
    "precio": 1200000,
    "imagen": "imagenes/playstation-5.jpg"
  }
];

// ===== CARRITO =====
const botonesAgregar = document.querySelectorAll('.boton-agregar');
const contadorCarrito = document.getElementById('contador-carrito');

const carrito = [];

function agregarAlCarrito(productoId) {
  const item = carrito.find(function(item) {
    return item.productoId === productoId;
  });

  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({
      productoId: productoId,
      cantidad: 1
    });
  }
}

function actualizarContador() {
  const totalUnidades = carrito.reduce(function(total, item) {
    return total + item.cantidad;
  }, 0);

  contadorCarrito.textContent = totalUnidades;
}

actualizarContador();

// Recorremos todos los botones "Agregar al carrito"
botonesAgregar.forEach(function(boton) {
  boton.addEventListener('click', function(event) {
    const id = event.currentTarget.dataset.productoId;
    const producto = productos.find(function(producto) {
      return producto.id === id;
    });

    if (!producto) {
      console.error('No se encontró el producto:', id);
      return;
    }

    agregarAlCarrito(producto.id);
    actualizarContador();
    console.log('Carrito actualizado:', structuredClone(carrito));

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
// ===== APERTURA Y CIERRE DEL CARRITO =====
const botonAbrirCarrito = document.getElementById('abrir-carrito');
const botonCerrarCarrito = document.getElementById('cerrar-carrito');
const panelCarrito = document.getElementById('panel-carrito');
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
let cierrePendiente = false;
let temporizadorCierre = null;

function limpiarCierrePendiente() {
  clearTimeout(temporizadorCierre);
  temporizadorCierre = null;
  cierrePendiente = false;
}

function finalizarCierreCarrito() {
  limpiarCierrePendiente();
  panelCarrito.classList.remove('carrito-panel--abierto');
  document.body.classList.remove('carrito-abierto');
  if (panelCarrito.open) {
    panelCarrito.close();
  }
  botonAbrirCarrito.focus({ preventScroll: true });
}

function abrirCarrito() {
  if (panelCarrito.open && !cierrePendiente) {
    return;
  }

  limpiarCierrePendiente();
  if (!panelCarrito.open) {
    panelCarrito.showModal();
  }
  document.body.classList.add('carrito-abierto');

  // Commit the initial position before applying the visible state.
  panelCarrito.getBoundingClientRect();
  panelCarrito.classList.add('carrito-panel--abierto');
  botonCerrarCarrito.focus({ preventScroll: true });
}

function cerrarCarrito() {
  if (!panelCarrito.open) {
    finalizarCierreCarrito();
    return;
  }
  if (cierrePendiente) {
    return;
  }

  const estabaVisible = panelCarrito.classList.contains('carrito-panel--abierto');
  cierrePendiente = true;
  panelCarrito.classList.remove('carrito-panel--abierto');

  const estilos = window.getComputedStyle(panelCarrito);
  const duraciones = estilos.transitionDuration.split(',');
  const demoras = estilos.transitionDelay.split(',');
  const propiedades = estilos.transitionProperty.split(',');
  function milisegundos(valor) {
    const tiempo = valor.trim();
    return parseFloat(tiempo) * (tiempo.endsWith('ms') ? 1 : 1000);
  }

  const espera = propiedades.reduce(function(maximo, propiedad, indice) {
    if (!['transform', 'all'].includes(propiedad.trim())) {
      return maximo;
    }
    const duracion = milisegundos(duraciones[indice % duraciones.length]);
    const demora = milisegundos(demoras[indice % demoras.length]);
    return duracion > 0 ? Math.max(maximo, duracion + demora) : maximo;
  }, 0);

  if (movimientoReducido.matches || !estabaVisible || espera <= 0) {
    finalizarCierreCarrito();
    return;
  }

  // Also finish if transitionend never arrives or the transition is interrupted.
  temporizadorCierre = setTimeout(finalizarCierreCarrito, espera + 50);
}

botonAbrirCarrito.addEventListener('click', abrirCarrito);
botonCerrarCarrito.addEventListener('click', cerrarCarrito);

panelCarrito.addEventListener('cancel', function(event) {
  event.preventDefault();
  cerrarCarrito();
});

panelCarrito.addEventListener('click', function(event) {
  if (event.target !== panelCarrito) {
    return;
  }
  const limites = panelCarrito.getBoundingClientRect();
  const dentro = event.clientX >= limites.left && event.clientX <= limites.right
    && event.clientY >= limites.top && event.clientY <= limites.bottom;
  if (!dentro) {
    cerrarCarrito();
  }
});

panelCarrito.addEventListener('transitionend', function(event) {
  if (cierrePendiente && event.target === panelCarrito
      && event.propertyName === 'transform' && !event.pseudoElement) {
    finalizarCierreCarrito();
  }
});

panelCarrito.addEventListener('close', function() {
  // Ignore an old close event if the dialog has already been reopened.
  if (!panelCarrito.open) {
    finalizarCierreCarrito();
  }
});

movimientoReducido.addEventListener('change', function(event) {
  if (event.matches && cierrePendiente) {
    finalizarCierreCarrito();
  }
});

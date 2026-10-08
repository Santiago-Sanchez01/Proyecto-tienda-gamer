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

function disminuirCantidad(productoId) {
  const item = carrito.find(function(item) {
    return item.productoId === productoId;
  });
  if (!item) {
    return false;
  }
  if (item.cantidad > 1) {
    item.cantidad -= 1;
    return true;
  }
  if (item.cantidad === 1) {
    return eliminarDelCarrito(productoId);
  }
  return false;
}

function eliminarDelCarrito(productoId) {
  const indice = carrito.findIndex(function(item) {
    return item.productoId === productoId;
  });
  if (indice === -1) {
    return false;
  }
  carrito.splice(indice, 1);
  return true;
}

function actualizarContador() {
  const totalUnidades = carrito.reduce(function(total, item) {
    return total + item.cantidad;
  }, 0);

  contadorCarrito.textContent = totalUnidades;
}

// ===== VISTA DEL CARRITO =====
const listaCarrito = document.getElementById('carrito-lista');
const mensajeCarritoVacio = document.getElementById('carrito-vacio');
const totalCarrito = document.getElementById('carrito-total');
const formatoPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

function formatearPrecio(valor) {
  return formatoPesos.format(valor);
}

function crearItemCarrito(producto, cantidad) {
  const item = document.createElement('li');
  item.className = 'carrito-item';

  const imagen = document.createElement('img');
  imagen.className = 'carrito-item-imagen';
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;

  const datos = document.createElement('div');
  datos.className = 'carrito-item-datos';

  const nombre = document.createElement('h3');
  nombre.textContent = producto.nombre;
  const precio = document.createElement('p');
  precio.textContent = 'Precio unitario: ' + formatearPrecio(producto.precio);
  const unidades = document.createElement('p');
  unidades.textContent = 'Cantidad: ' + cantidad;
  const subtotal = document.createElement('p');
  subtotal.textContent = 'Subtotal: ' + formatearPrecio(producto.precio * cantidad);

  const controles = document.createElement('div');
  controles.className = 'carrito-item-controles';

  const acciones = [
    { accion: 'aumentar', texto: '+', etiqueta: 'Aumentar cantidad de ' },
    { accion: 'disminuir', texto: '-', etiqueta: 'Disminuir cantidad de ' },
    { accion: 'eliminar', texto: 'Eliminar', etiqueta: 'Eliminar del carrito ' }
  ];

  acciones.forEach(function(accion) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'carrito-control';
    if (accion.accion === 'eliminar') {
      boton.classList.add('carrito-control--eliminar');
    }
    boton.dataset.accion = accion.accion;
    boton.dataset.productoId = producto.id;
    boton.setAttribute('aria-label', accion.etiqueta + producto.nombre);
    boton.textContent = accion.texto;
    controles.append(boton);
  });

  datos.append(nombre, precio, unidades, subtotal, controles);
  item.append(imagen, datos);
  return item;
}

function renderizarCarrito() {
  const focoAnterior = guardarFocoCarrito();
  const fragmento = document.createDocumentFragment();
  let productosVisibles = 0;
  const total = carrito.reduce(function(acumulado, item) {
    const producto = productos.find(function(producto) {
      return producto.id === item.productoId;
    });

    if (!producto) {
      console.warn('Producto del carrito no encontrado:', item.productoId);
      return acumulado;
    }

    fragmento.append(crearItemCarrito(producto, item.cantidad));
    productosVisibles += 1;
    return acumulado + producto.precio * item.cantidad;
  }, 0);

  listaCarrito.replaceChildren(fragmento);
  mensajeCarritoVacio.hidden = productosVisibles > 0;
  totalCarrito.textContent = formatearPrecio(total);
  restaurarFocoCarrito(focoAnterior);
}

function guardarFocoCarrito() {
  const activo = document.activeElement;
  if (!activo || !listaCarrito.contains(activo)) {
    return null;
  }
  const boton = activo.closest('button[data-accion][data-producto-id]');
  if (!boton) {
    return null;
  }
  const ids = Array.from(listaCarrito.children, function(fila) {
    return fila.querySelector('button[data-producto-id]').dataset.productoId;
  });
  return {
    productoId: boton.dataset.productoId,
    accion: boton.dataset.accion,
    indice: ids.indexOf(boton.dataset.productoId)
  };
}

function restaurarFocoCarrito(contexto) {
  if (!contexto || !panelCarrito.open || cierrePendiente) {
    return;
  }
  const filas = Array.from(listaCarrito.children);
  const controles = Array.from(listaCarrito.querySelectorAll('button[data-accion]'));
  let destino = controles.find(function(boton) {
    return boton.dataset.productoId === contexto.productoId
      && boton.dataset.accion === contexto.accion;
  });

  if (!destino && filas.length > 0) {
    const fila = filas[Math.min(contexto.indice, filas.length - 1)];
    destino = Array.from(fila.querySelectorAll('button[data-accion]')).find(function(boton) {
      return boton.dataset.accion === contexto.accion;
    });
  }

  destino = destino || botonCerrarCarrito;
  destino.focus({ preventScroll: true });
  if (listaCarrito.contains(destino)) {
    destino.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}

function actualizarVistaCarrito() {
  actualizarContador();
  renderizarCarrito();
  console.log('Carrito actualizado:', structuredClone(carrito));
}

function manejarAccionCarrito(event) {
  const boton = event.target.closest('button[data-accion][data-producto-id]');
  if (!boton || !event.currentTarget.contains(boton) || !panelCarrito.open || cierrePendiente) {
    return;
  }
  const accion = boton.dataset.accion;
  const productoId = boton.dataset.productoId;
  const producto = productos.find(function(producto) {
    return producto.id === productoId;
  });
  const item = carrito.find(function(item) {
    return item.productoId === productoId;
  });

  if (!['aumentar', 'disminuir', 'eliminar'].includes(accion)
      || !producto || !item || !Number.isInteger(item.cantidad) || item.cantidad < 1) {
    return;
  }

  // Keep the activated control as the focus reference, including pointer clicks.
  boton.focus({ preventScroll: true });
  if (accion === 'aumentar') {
    agregarAlCarrito(productoId);
  } else if (accion === 'disminuir') {
    disminuirCantidad(productoId);
  } else {
    eliminarDelCarrito(productoId);
  }
  actualizarVistaCarrito();
}

listaCarrito.addEventListener('click', manejarAccionCarrito);

actualizarContador();
renderizarCarrito();

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
    actualizarVistaCarrito();

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
  renderizarCarrito();

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

// 1. Estructuras de datos y Variables globales
let productos = [];
const URL_API = 'https://httpbin.org/post'; // API pública

// Referencias al DOM
const inputNombre = document.getElementById('nombreProducto');
const inputPrecio = document.getElementById('precioProducto');
const btnAgregar = document.getElementById('btnAgregar');
const btnSincronizar = document.getElementById('btnSincronizar');
const listaProductos = document.getElementById('listaProductos');
const mensajeDiv = document.getElementById('mensajeDiv');

// 2. Interacción y Validaciones


function mostrarMensaje(texto, esExito) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'mensaje ' + (esExito ? 'exito' : 'error');
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

// 3. Manipulación Dinámica del DOM


function renderizarProductos() {
    // Limpiar lista antes de renderizar
    listaProductos.innerHTML = '';

    productos.forEach(producto => {
       
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} - $${producto.precio}`;
        
        // Crear botón Eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('delete-btn');
        
        //  para eliminar elemento
        btnEliminar.onclick = () => {
            eliminarProducto(producto.id);
        };

        // Agregar botón al <li> y <li> a la lista
        li.appendChild(btnEliminar);
        listaProductos.appendChild(li);
    });
}

function agregarProductoDOM() {
    const nombre = inputNombre.value.trim();
    const precio = inputPrecio.value.trim();

    // Validar campos vacíos
    if (!nombre || !precio) {
        mostrarMensaje('Por favor, completa todos los campos.', false);
        return;
    }

    // Crear nuevo objeto producto
    const nuevoProducto = {
        id: Date.now().toString(), // Generar ID único basado en tiempo
        nombre: nombre,
        precio: parseFloat(precio)
    };

    // Agregar al arreglo global
    productos.push(nuevoProducto);

    // Actualizar DOM y Local Storage
    guardarEnLocalStorage();
    renderizarProductos();

    // Limpiar inputs
    inputNombre.value = '';
    inputPrecio.value = '';
    mostrarMensaje('Producto agregado exitosamente.', true);
}

function eliminarProducto(id) {
    // Eliminar del arreglo usando filter
    productos = productos.filter(prod => prod.id !== id);
    
    // Actualizar DOM y Local Storage
    guardarEnLocalStorage();
    renderizarProductos();
    mostrarMensaje('Producto eliminado del DOM y Local Storage.', true);
}


// 4. Persistencia en Local Storage


function guardarEnLocalStorage() {
    localStorage.setItem('productosLocales', JSON.stringify(productos));
}

function cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem('productosLocales');
    if (datosGuardados) {
        productos = JSON.parse(datosGuardados);
        renderizarProductos();
    }
}


// 5. Integración con Fetch API


async function sincronizarConAPI() {
    try {
        mostrarMensaje('Sincronizando con el servidor...', true);
        
        // Simulación POST con Fetch API usando async/await
        const respuesta = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productos)
        });

        // Manejo de respuesta
        if (!respuesta.ok) throw new Error('Error en la comunicación con el servidor');
        
        const datosServidor = await respuesta.json();
        console.log('Respuesta del servidor (POST):', datosServidor);
        
        mostrarMensaje('¡Sincronización con la API exitosa!', true);
    } catch (error) {
        console.error('Error al sincronizar:', error);
        mostrarMensaje('Falló la sincronización con la API.', false);
    }
}


// 6. Eventos y Pruebas Iniciales


btnAgregar.addEventListener('click', agregarProductoDOM);
btnSincronizar.addEventListener('click', sincronizarConAPI);

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarDesdeLocalStorage);

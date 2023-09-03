//############################  VARIABLES GLOBALES  #################################//

// Declaro una copia de los productos originales
let productosOriginales = []

// Declaro un array vacio para mostrar productos
let productos = []

// Declaro un array vacio para el carrito
let carrito = []

// Declaro una variable para el precioDolar
let precioDolar

//############################  VARIABLES PARA ELEMENTOS DEL DOM  #################################//
const contenedorProductos = document.querySelector(".contenedor-productos")
const botonCategorias = document.querySelectorAll("boton-categoria")



//############################  FUNCIONES  #################################//

function cargarProductos(productosElegidos) {
    // Vacio el contenedor
    contenedorProductos.innerHTML = ""

    // Creo la estructura HTML
    productosElegidos.forEach(producto => {
        const div = document.createElement("div")
        div.classList.add("producto")
        div.innerHTML = `
            <img class="producto-imagen" src="${[producto.img]}" alt="${[producto.titulo]}">
            <div class="producto-detalles">
                <h2 class="producto-titulo">${[producto.nombre]}</h2>
                <p class="producto-precio">${[producto.precio * precioDolar]}</p>
                <button class="producto-agregar" id="${[producto.id]}">Agregar</button>
            </div>
        `
        // Lo agrego al div
        contenedorProductos.append(div)
    })
}

// Cargo los productos desde el archivo JSON
fetch('productos.json')
  .then((response) => response.json())
  .then((data) => {
    // Guardo la data en variables globales
    productosOriginales = data
    productos = data

    // Segunda solicitud para obtener el valor del dólar
    return fetch('https://api.bluelytics.com.ar/v2/latest');
  })
  .then((resp) => resp.json())
  .then((data) => {
    // Guardo la data en la variable global
    precioDolar = data.blue.value_avg;

    // Cargo los productos
    cargarProductos(productosOriginales)

    // Evento para elegir categoria
    botonCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonCategorias.forEach(boton => boton.classList.remove("active"))
            e.currentTarget.classList.add("active")

            // Mostrar los elementos en pantalla
            const productosFiltrados = productos.filter(producto => producto.categoria === e.currentTarget.id)
            cargarProductos(productosFiltrados)
        })
    })
  })

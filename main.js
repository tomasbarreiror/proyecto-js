//################## ESTRUCTURAS HTML //##################

const seccionPago = `
<h1 class="text-center">Confirmar tu compra</h1>
<div class="row">
    <div id="confirmar-productos" class="col-4">
        <ul id="lista-comprar"></ul>
        <p id="precio-carrito"></p>
    </div>
    <div class="col-8">
        <div class="mb-3 form-group">
            <label for="nombre" class="form-label">Nombre y Apellido</label>
            <input type="text" id="nombre" class="form-control">
        </div>
        <div class="mb-3 form-group">
            <label for="correo" class="form-label">Correo electronico</label>
            <input type="email" id="correo" class="form-control">
        </div>
        <div class="mb-3 form-group">
            <label for="telefono" class="form-label">Telefono</label>
            <input type="tel" id="telefono" class="form-control">
        </div>
        <div class="mb-3 form-group">
            <label for="cuotas" class="form-label">Cantidad de cuotas</label>
            <select type="text" id="cuotas">
                <option value="">1 cuota de $</option>
                <option value="">3 cuotas de $</option>
                <option value="">6 cuotas de $</option>
                <option value="">12 cuotas de $</option>
            </select>
        </div>
    </div>
</div>
<div class="row">
    <h2 class="text-center">Datos de la tarjeta</h2>
    <div class="col-12">Mastercard o Visa</div>
    <div class="col-7">
        <div class="mb-1 form-group">
            <label for="num-tarjeta" class="form-label">Numero de tarjeta</label>
            <input id="num-tarjeta" type="number" class="form-control">
        </div>
        <div class="mb-1 form-group">
            <label for="nombre-tarjeta" class="form-label">Nombre</label>
            <input id="nombre-tarjeta" type="text" class="form-control">
        </div>
        <div class="mb-1 form-group">
            <label for="cvc" class="form-label">CVC</label>
            <input id="cvc" type="number" class="form-control">
        </div>
    </div>
    <div class="col-4">
        <div class="form-group">
            <label for="vencimiento">Fecha de vto.</label>
            <input id="vencimiento" type="date" class="form-control">
        </div>
    </div>
</div>
<div class="row">
    <input type="submit" value="Confirmar" id="confirmar-pago">
</div>
`


//################## VARIABLES GLOBALES ##################//

// Declaro un array vacio para mostrar productos
let productos = []

// Declaro un array vacio para el carrito
let carrito = []

// Declaro una variable para el precio del dolar
let precioDolar


//################## VARIABLES DEL DOM ##################//

// Declaro la variable donde se muestran los productos
const divProductos = document.getElementById("productos")

// Declaro la variable todos los botones de las categorias
const botonCategorias = document.querySelectorAll(".boton-categorias")

// Declaro la variable para agregar al carrito
let agregarCarrito = document.querySelectorAll(".agregar-carrito")

// Declaro las variables para los elementos del carrito
const cerrarCarrito = document.getElementById("cerrar-carrito")
const carritoAside = document.getElementById("carrito-aside")
const carritoBoton = document.getElementById("carrito")
const listaCarrito = document.getElementById("lista-carrito")
const comprarCarrito = document.getElementById("comprar")

// Declaro la variable para el section
const section = document.getElementById("#inicio")


//################## FUNCIONES ##################//

// Funcion para crear el HTML de los productos
function crearProductos(productosElegidos) {

    // Vacio el contenedor
    divProductos.innerHTML = ""

    productosElegidos.forEach(producto => {
        // Crear contenedor para cada producto
        const contenedor = document.createElement("div")
        contenedor.classList.add("contenedor-producto")

        //Agregar la imagen y el cuerpo de la card
        const card = document.createElement("div")
        card.classList.add("card")
        card.innerHTML = `<img src="${producto.img}">`

        // Agregar nombre, precio y boton del producto'
        const contenidoCard = document.createElement("div")
        contenidoCard.classList.add = "card-body"
        contenidoCard.innerHTML = `
            <h5 class="text-center">${producto.nombre}</h5>
            <p class="text-center">$${producto.precio * precioDolar}</p>
            <button class="agregar-carrito text-center" id="${producto.id}">Agregar al carrito</button>
        `

        // Los agrego
        card.appendChild(contenidoCard)
        contenedor.appendChild(card)
        divProductos.appendChild(contenedor)
        actualizarAgregarCarrito()
    })
}

// Funcion para actualizar los botones luego de que hayan sido creados
function actualizarAgregarCarrito() {
    agregarCarrito = document.querySelectorAll(".agregar-carrito")

    agregarCarrito.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}

// Funcion para agregar productos al carrito
function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id
    const productoAgregado = productos.find(producto => producto.id == idBoton)

    // Si el producto ya se encuentra en el carro
    if (carrito.some(producto => producto.id == idBoton)) {
        const i = carrito.findIndex(producto => producto.id == idBoton)
        carrito[i].cantidad++
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: 'Agregaste otra unidad del producto',
            showConfirmButton: false,
            timer: 1000,
            toast: true
        })
    } else {
        productoAgregado.cantidad = 1
        carrito.push(productoAgregado)
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 1000,
            toast: true,
        })
    }

    // Eliminar 1 unidad si la cantidad del producto es mayor al stock
    if (productoAgregado.cantidad > productoAgregado.stock) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay suficiente stock del producto',
        })
        carrito[i].cantidad = productoAgregado.stock
    }

    // Lo guardo en local Storage y actualizo la vista
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarVisualizacionCarrito()
}

// Funcion para actualizar la vista del carrito
function actualizarVisualizacionCarrito() {
    // Inicio el carrito vacio y con el precio en 0
    listaCarrito.innerHTML = ""
    precioTotal = 0
    
    // Mostrar productos en el carrito
    carrito.forEach((producto) => {
        // Declaro un <li> para cada producto
        const itemCarrito = document.createElement("li")

        // Declaro un boton para eliminar producto del carrito
        const eliminarItem = document.createElement("button")
        eliminarItem.classList.add("eliminar-carrito")
        eliminarItem.textContent = "Eliminar del carrito"
        eliminarItem.addEventListener("click", () => {
            // Obtengo el indice del carrito
            const i = carrito.findIndex(item => item.id === producto.id)
            if (i !== -1) {
                // Si hay uno solo lo elimino
                if (carrito[i].cantidad == 1) {
                    carrito.splice(i, 1)
                    Swal.fire({
                        position: 'bottom-end',
                        icon: 'info',
                        title: 'Producto eliminado del carrito',
                        showConfirmButton: false,
                        timer: 1000,
                        toast: true,
                    })
                // Si hay mas de uno, resto uno a la cantidad
                } else {
                    carrito[i].cantidad--
                    Swal.fire({
                        position: 'bottom-end',
                        icon: 'info',
                        title: 'Restaste una unidad del producto',
                        showConfirmButton: false,
                        timer: 1000,
                        toast: true,
                    })
                }
                localStorage.setItem("carrito", JSON.stringify(carrito))
            }
            actualizarVisualizacionCarrito()
        })      
        
        // Lo agrego al <li>
        itemCarrito.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad}`
        itemCarrito.appendChild(eliminarItem)

        // Actualizo el precio y el carrito
        listaCarrito.appendChild(itemCarrito)
        precioTotal += producto.precio * precioDolar * producto.cantidad
    })

    // Mostrar el precio total en el aside
    const precioTotalTexto = document.getElementById("precio-total")
    precioTotalTexto.textContent = `Precio total: $${precioTotal}`
}

function comprandoCarrito() {
    // Cambio el ID de la section y su contenido
    section.id = "pago"
    section.innerHTML = seccionPago

    // Oculto el carrito y el boton para abrirlo
    carritoAside.style.display = "none"
    carritoBoton.style.display = "none"

    // Obtengo el div donde van los productos y creo la lista
    const listaComprar = document.getElementById("lista-comprar")

    // Mostrar productos en el carrito
    carrito.forEach((producto) => {

        // Declaro un <li> para cada producto
        const itemCarrito = document.createElement("li")    
        
        // Agrego el contenido del <li>
        itemCarrito.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad}`

        // Agrego el <li> a la lista
        listaComprar.appendChild(itemCarrito)
    })

    // Mostrar el precio final
    const precioFinal = document.getElementById("precio-carrito")
    precioFinal.textContent = `Precio total: $${precioTotal.toFixed(2)}`
}

//################## CARGA DE JSON ##################//

fetch("productos.json")
.then((resp) => resp.json())
.then((data) => {
    productos = data

    return fetch("https://api.bluelytics.com.ar/v2/latest")
})
.then((resp) => resp.json())
.then((data) => {
    precioDolar = data.blue.value_avg

    const carritoAlmacenado = localStorage.getItem("carrito")
    if (carritoAlmacenado) {
        carrito = JSON.parse(carritoAlmacenado)
        actualizarVisualizacionCarrito()
    }

    // Muestro todos los productos en pantalla
    crearProductos(productos)

    // Evento para los botones de categorias
    botonCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonCategorias.forEach(boton => {
                boton.classList.remove("active")
            })
            e.currentTarget.classList.add("active")
            const productosBoton = productos.filter(producto => producto.categoria === e.currentTarget.id)
            crearProductos(productosBoton)
        })
    })

    // Evento para abrir el carrito
    carritoBoton.addEventListener("click", () => {
        carritoAside.style.display = "block"
        actualizarVisualizacionCarrito()
    })

    // Evento para cerrar el carrito
    cerrarCarrito.addEventListener("click", () => {
        carritoAside.style.display = "none"
    })

    // Evento para ir a seccion de pago
    comprarCarrito.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'El carrito esta vacio!',
                text: 'Agrega productos y gastatela toda',
            })
        } else {
            comprandoCarrito()
        }
    })    
})
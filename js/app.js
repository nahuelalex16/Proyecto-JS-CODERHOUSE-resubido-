
//Definicion de variables
const buscador = document.querySelector("#searchBox"),
    index = document.querySelector("#index"),
    contenedor = document.querySelector("#catalogo"),
    miCarrito = document.querySelector("#carrito"),
    resumenCarrito = document.querySelector("#resumenCarrito"),
    precioTotal = document.querySelector("#precioTotal"),
    vaciarCarrito = document.querySelector(".vaciarCarrito");


let productos=[], carrito, precioFinal;

//Cargar carrito


const checkCarrito = localStorage.getItem("carrito") ? true : false;

const cargarCarrito = () =>{
    carrito = JSON.parse(localStorage.getItem("carrito"));
};

checkCarrito ?  cargarCarrito() : carrito = [];

//Funciones

async function fetchData() {
    const response = await fetch('../data/productos.json');
    const data = await response.json();

    productos = data;
    console.log(productos);

    crearHTML(productos)

    document.querySelectorAll(".agregarProd").forEach(el => {
        el.addEventListener("click", e => {
          const id = e.target.getAttribute("id");
          añadirProd(id, productos)
          guardarCarrito(carrito)
        });
      });
}

function filtrarProductos(filtro){
    const filtrado = productos.filter((el) =>{ 
        return el.nombre.includes(filtro)
    })

    return filtrado
}

//Crear Catalogo de Productos

function crearHTML (arr) {
    let card;
    contenedor.innerHTML = "";
    resumenCarrito.innerHTML="";
    precioTotal.innerHTML ="";
    arr.forEach(producto => {
        const {nombre, precio, img, id} = producto;
        card = `
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div class="card producto">
          <img src="./img/${img}" alt="${nombre}" class="card-img-top card-img-auto">
          <div class="card-body">
            <h5 class="card-title">${nombre.toUpperCase()}</h5>
            <p class="card-text">Precio: $ARG ${precio}</p>
            <button type="button" class="btn btn-light agregarProd" id="${id}">Agregar al carrito</button>
          </div>
        </div>
      </div>
        `
        contenedor.innerHTML += card;
    })
}

//Agregar productos al carrito

function añadirProd(id, data){
    const existeProd = carrito.some((producto) => producto.id === id);

    const sumarProd = carrito.map((prod) => {
        prod.id === id ? prod.cant++ : true;
    })

    const prod = data.find((prod) => prod.id === id);

    existeProd ? sumarProd : carrito.push(prod);
    guardarCarrito(carrito);
    console.log(carrito);
    
}

//Quitar productos del carrito

function eliminarProd(id){
    let buscarProd = carrito.find((prod) => prod.id === id);

    const indexProd = carrito.indexOf(buscarProd);
    
    console.log(indexProd);

    carrito.splice(indexProd, 1);

}

//Guardar carrito en LocalStorage

function guardarCarrito(arr){
    return localStorage.setItem('carrito', JSON.stringify(arr));
}

//Crear resumen de compra

function crearResumen (array) {
    let item;
    resumenCarrito.innerHTML="";
    contenedor.innerHTML = "";
        for (const itemProd of array) {
        const {nombre, precio, id, cant} = itemProd;
        item = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <h5>${nombre.toUpperCase()}</h5>
            <span class="badge bg-primary rounded-pill">ID: ${id}</span>
            <span class="badge bg-primary rounded-pill">Cantidad: ${cant}</span>
            <span class="badge bg-secondary rounded-pill">Precio: ${cant * precio}</span>
            <button type="button" class="btn btn-danger eliminarProd" id="${id}">Eliminar</button>
        </li>
        `

        resumenCarrito.innerHTML += item;
    }
    const subtotal = carrito.reduce(
        (acc, prod) => acc + prod.cant * prod.precio, 0
    );
    precioTotal.innerHTML = '<h2>Total a Pagar: <span class="badge bg-secondary">$ '+subtotal+'</span></h2>';

    vaciarCarrito.innerHTML = '<button type="button" class="btn btn-danger" id="limpiarCarrito">Vaciar Carrito</button>'

    document.querySelectorAll(".eliminarProd").forEach((el) => {
        el.addEventListener('click', (e) => {
            const idProd = e.target.getAttribute("id")
            eliminarProd(idProd)
            guardarCarrito(carrito)
            crearResumen(carrito)
        })
    })


    document.querySelector("#limpiarCarrito").addEventListener('click', () => {
        carrito.length = [];
        guardarCarrito(carrito)
        crearResumen(carrito);
    })

    carrito.length == 0 ? contenedor.innerHTML = '<h1 class="text-center text-secondary display-1">¡El carrito está vacio!</h1>' : true;
}

//Eventos

buscador.addEventListener("input", () =>{
    const filtro = filtrarProductos(buscador.value)
    crearHTML(filtro)
})

index.addEventListener('click', () => {
    window.location.href = ("./index.html");
})


miCarrito.onclick = () => {
    crearResumen(carrito);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})


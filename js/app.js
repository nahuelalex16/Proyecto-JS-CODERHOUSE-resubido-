
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

    crearHTML(productos);

    document.querySelectorAll(".agregarProd").forEach(el => {
        el.addEventListener('click', (e) => {
            const id = e.target.getAttribute("id");
            prodAlert(id, productos)
        })
    })
    
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

function añadirProd(id, arr, cant){
    const existeProd = carrito.some((producto) => producto.id === id);

    const sumarProd = carrito.map((prod) => {
        prod.id === id ? parseFloat(prod.cant += cant) : true;
    })

    const prod = arr.find((prod) => prod.id === id);

    const nuevoProd = () => {
        prod.cant = cant;
        carrito.push(prod)
    }

    existeProd ? sumarProd : nuevoProd();
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

            Swal.fire({
                title: '¿Desea quitar este producto del carrito?',
                text: "¡No se puede revertir la acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, quitar producto!'
              }).then((result) => {
                if (result.isConfirmed) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                      })

                    Toast.fire({
                        icon: 'success',
                        title: 'Producto eliminado',
                    })
                    eliminarProd(idProd),
                    guardarCarrito(carrito),
                    crearResumen(carrito)
                }
        })
    })
    },


    document.querySelector("#limpiarCarrito").addEventListener('click', () => {
        Swal.fire({
            title: '¿Seguro que quiere vaciar el carrito?',
            text: "¡No se puede revertir la acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, vaciar carrito!'
          }).then((result) => {
            if (result.isConfirmed && carrito.length != 0) {
              Swal.fire(
                '¡Realizado!',
                'Se vació el carrito',
                'success',
                carrito.length = [],
                guardarCarrito(carrito),
                crearResumen(carrito)
              )
            } else if (result.isConfirmed && carrito.length == 0){
                Swal.fire(
                '¡Error!',
                'El carrito está vacio',
                'error'
            )}
          })

        
    }),

    carrito.length == 0 ? contenedor.innerHTML = '<h1 class="text-center text-secondary display-1">¡El carrito está vacio!</h1>' : true
    )}

//Crear sweet alert de compra

function prodAlert(el, arr){

    for (const prod of arr) {
        const {nombre, precio, img, id} = prod;

        while (el === id) {
            Swal.fire({
            html: `
            <h1>${nombre.toUpperCase()}</h1>
            <img src="./img/${img}" alt="${nombre}" class="imgAlert">
            <div class="card-body">
                <p class="card-text">Precio por unidad: $ARG ${precio}</p>
                <div class="d-flex justify-content-center">
                    <input class="m-2 form-control" type="number" value="1" min="1" id="prodCant">
                </div>
            </div>
            `,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Comprar",
            cancelButtonText: "Cancelar",
        })

        .then(res => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

            prodCant = document.querySelector("#prodCant")

            res.isConfirmed ?
            Toast.fire({
                icon: 'success',
                title: 'Compra Realizada',
                text: 'El producto se está agregando al carrito'
              })
            && añadirProd(id, productos, parseFloat(prodCant.value))
            && guardarCarrito(carrito):

            res.isDenied ?
            
            Swal.fire('Compra cancelada', '', 'error'):true;
        })

        console.log(prodCant.value);

        break;
        }
        

    }
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



/*document.querySelectorAll(".agregarProd").forEach(el => {
    el.addEventListener("click", e => {
      const id = e.target.getAttribute("id");
      añadirProd(id, productos)
      guardarCarrito(carrito)
    });
  });*/
//Definicion de variables
const emailReg = document.querySelector("#emailReg"),
    nameReg = document.querySelector("#nameReg"),
    usernameReg = document.querySelector("#usernameReg"),
    passwordReg = document.querySelector("#passwordReg"),
    btnRegistro = document.querySelector("#btnReg");

let usuarios;


//Verificacion de usuarios en Local Storage

const checkUsuarios = localStorage.getItem("usuarios") ? true : false,
    cargarUsuarios = () =>{
        usuarios = JSON.parse(localStorage.getItem("usuarios"))
    };

checkUsuarios ?  cargarUsuarios() : usuarios = [];


//Crear Usuario

class Usuario{
    constructor(nombre, username, email, contraseña, ){
        this.nombre = nombre;
        this.username = username;
        this.email = email;
        this.contraseña = contraseña;
    }
}

//Funciones

function guardarUsuario(usuario){
    return usuarios.push(usuario);
}

function guardarEnLS(el){
    return localStorage.setItem('usuarios', JSON.stringify(el));
}


//Eventos

btnRegistro.addEventListener('click',(e) => {
    e.preventDefault()

    let nuevoUsuario = new Usuario(nameReg.value, usernameReg.value, emailReg.value, passwordReg.value);
    console.log(nuevoUsuario);
    guardarUsuario(nuevoUsuario);
    guardarEnLS(usuarios);
    window.location.href = "../login.html";
})





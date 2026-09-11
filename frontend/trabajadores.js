const btnAgregar = document.getElementById("btnAgregar");
const btnCancelar = document.getElementById("btnCancelar");
const formulario = document.getElementById("formularioTrabajador");

btnAgregar.addEventListener("click", function () {
    formulario.style.display = "block";
});

btnCancelar.addEventListener("click", function () {
    formulario.style.display = "none";
});
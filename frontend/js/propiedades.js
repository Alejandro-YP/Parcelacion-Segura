document.addEventListener("DOMContentLoaded", function () {

    const btnAgregar = document.getElementById("btnAgregar");
    const btnGuardar = document.getElementById("btnGuardar");
    const btnCancelar = document.getElementById("btnCancelar");

    const formulario = document.getElementById("formularioPropiedad");
    const listaPropiedades = document.getElementById("listaPropiedades");

    const codigo = document.getElementById("codigo");
    const numero = document.getElementById("numero");
    const propietario = document.getElementById("propietario");
    const telefono = document.getElementById("telefono");
    const ubicacion = document.getElementById("ubicacion");
    const observaciones = document.getElementById("observaciones");

    const buscarPropiedad = document.getElementById("buscarPropiedad");

    let siguienteId = 2;
    let filaEditando = null;

    btnAgregar.addEventListener("click", function () {
        filaEditando = null;
        formulario.style.display = "block";
        limpiarFormulario();
    });

    btnCancelar.addEventListener("click", function () {
        formulario.style.display = "none";
        limpiarFormulario();
        filaEditando = null;
    });

    btnGuardar.addEventListener("click", function () {

        if (
            codigo.value.trim() === "" ||
            numero.value.trim() === "" ||
            propietario.value.trim() === "" ||
            telefono.value.trim() === "" ||
            ubicacion.value.trim() === ""
        ) {
            alert("Por favor complete los campos obligatorios.");
            return;
        }

        if (filaEditando !== null) {

            filaEditando.cells[1].textContent = codigo.value;
            filaEditando.cells[2].textContent = numero.value;
            filaEditando.cells[3].textContent = propietario.value;
            filaEditando.cells[4].textContent = telefono.value;
            filaEditando.cells[5].textContent = ubicacion.value;

            alert("Propiedad actualizada correctamente.");

        } else {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${siguienteId}</td>
                <td>${codigo.value}</td>
                <td>${numero.value}</td>
                <td>${propietario.value}</td>
                <td>${telefono.value}</td>
                <td>${ubicacion.value}</td>
                <td>Activa</td>
                <td>
                    <button class="btnEditar">Editar</button>
                    <button class="btnEliminar">Eliminar</button>
                </td>
            `;

            listaPropiedades.appendChild(fila);

            siguienteId++;

            alert("Propiedad registrada correctamente.");
        }

        limpiarFormulario();
        formulario.style.display = "none";
        filaEditando = null;
    });

    listaPropiedades.addEventListener("click", function (evento) {

        if (evento.target.classList.contains("btnEditar")) {

            filaEditando = evento.target.closest("tr");

            codigo.value = filaEditando.cells[1].textContent;
            numero.value = filaEditando.cells[2].textContent;
            propietario.value = filaEditando.cells[3].textContent;
            telefono.value = filaEditando.cells[4].textContent;
            ubicacion.value = filaEditando.cells[5].textContent;

            formulario.style.display = "block";
        }

        if (evento.target.classList.contains("btnEliminar")) {

            const fila = evento.target.closest("tr");

            if (confirm("¿Está seguro de eliminar esta propiedad?")) {
                fila.remove();
                alert("Propiedad eliminada correctamente.");
            }
        }
    });

    buscarPropiedad.addEventListener("input", function () {

        const texto = buscarPropiedad.value.toLowerCase();
        const filas = listaPropiedades.getElementsByTagName("tr");

        for (let fila of filas) {

            const contenido = fila.textContent.toLowerCase();

            if (contenido.includes(texto)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    });

    function limpiarFormulario() {
        codigo.value = "";
        numero.value = "";
        propietario.value = "";
        telefono.value = "";
        ubicacion.value = "";
        observaciones.value = "";
    }

});
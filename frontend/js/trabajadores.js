document.addEventListener("DOMContentLoaded", function () {

    const btnAgregar = document.getElementById("btnAgregar");
    const btnGuardar = document.getElementById("btnGuardar");
    const btnCancelar = document.getElementById("btnCancelar");

    const formulario = document.getElementById("formularioTrabajador");
    const listaTrabajadores = document.getElementById("listaTrabajadores");

    const nombre = document.getElementById("nombre");
    const documento = document.getElementById("documento");
    const telefono = document.getElementById("telefono");
    const actividad = document.getElementById("actividad");

    let siguienteId = 2;
    let filaEditando = null;

    // AGREGAR
    btnAgregar.addEventListener("click", function () {
        filaEditando = null;
        formulario.style.display = "block";
        limpiarFormulario();
    });

    // CANCELAR
    btnCancelar.addEventListener("click", function () {
        formulario.style.display = "none";
        limpiarFormulario();
        filaEditando = null;
    });

    // GUARDAR
    btnGuardar.addEventListener("click", function () {

        if (
            nombre.value.trim() === "" ||
            documento.value.trim() === "" ||
            telefono.value.trim() === "" ||
            actividad.value.trim() === ""
        ) {
            alert("Por favor complete todos los campos.");
            return;
        }

        // Si estamos editando
        if (filaEditando !== null) {

            filaEditando.cells[1].textContent = nombre.value;
            filaEditando.cells[2].textContent = documento.value;
            filaEditando.cells[3].textContent = telefono.value;
            filaEditando.cells[4].textContent = actividad.value;

            alert("Trabajador actualizado correctamente.");

        } else {

            // Crear nuevo trabajador
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${siguienteId}</td>
                <td>${nombre.value}</td>
                <td>${documento.value}</td>
                <td>${telefono.value}</td>
                <td>${actividad.value}</td>
                <td>Activo</td>
                <td>
                    <button class="btnEditar">Editar</button>
                    <button class="btnEliminar">Eliminar</button>
                </td>
            `;

            listaTrabajadores.appendChild(fila);

            siguienteId++;

            alert("Trabajador registrado correctamente.");
        }

        limpiarFormulario();
        formulario.style.display = "none";
        filaEditando = null;
    });

    // EDITAR Y ELIMINAR
    listaTrabajadores.addEventListener("click", function (evento) {

        // EDITAR
        if (evento.target.classList.contains("btnEditar")) {

            filaEditando = evento.target.closest("tr");

            nombre.value = filaEditando.cells[1].textContent;
            documento.value = filaEditando.cells[2].textContent;
            telefono.value = filaEditando.cells[3].textContent;
            actividad.value = filaEditando.cells[4].textContent;

            formulario.style.display = "block";
        }

        // ELIMINAR
        if (evento.target.classList.contains("btnEliminar")) {

            const fila = evento.target.closest("tr");

            const confirmar = confirm(
                "¿Está seguro de eliminar este trabajador?"
            );

            if (confirmar) {
                fila.remove();
                alert("Trabajador eliminado correctamente.");
            }
        }

    });

    // LIMPIAR FORMULARIO
    function limpiarFormulario() {
        nombre.value = "";
        documento.value = "";
        telefono.value = "";
        actividad.value = "";
    }

        // BUSCAR TRABAJADOR
    const buscarTrabajador = document.getElementById("buscarTrabajador");

    buscarTrabajador.addEventListener("input", function () {

        const texto = buscarTrabajador.value.toLowerCase();
        const filas = listaTrabajadores.getElementsByTagName("tr");

        for (let fila of filas) {

            const contenido = fila.textContent.toLowerCase();

            if (contenido.includes(texto)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    });
});
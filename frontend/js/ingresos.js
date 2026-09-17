const API_URL = "http://localhost:3001";

// ==========================================
// ELEMENTOS
// ==========================================

const nuevoIngresoBtn = document.getElementById("nuevoIngresoBtn");
const formularioPanel = document.getElementById("formularioPanel");
const ingresoForm = document.getElementById("ingresoForm");
const entriesBody = document.getElementById("entriesBody");
const statusMessage = document.getElementById("statusMessage");

const buscarTrabajador = document.getElementById("buscarTrabajador");
const buscarPropiedad = document.getElementById("buscarPropiedad");
const buscarEstado = document.getElementById("buscarEstado");
const limpiarFiltros = document.getElementById("limpiarFiltros");

// ==========================================
// SIDEBAR
// ==========================================

const appShell = document.getElementById("appShell");
const collapseBtn = document.getElementById("collapseBtn");
const menuBtn = document.getElementById("menuBtn");

function toggleSidebar() {
    appShell.classList.toggle("is-collapsed");
}

collapseBtn.addEventListener("click", toggleSidebar);
menuBtn.addEventListener("click", toggleSidebar);

// ==========================================
// MOSTRAR / OCULTAR FORMULARIO
// ==========================================

nuevoIngresoBtn.addEventListener("click", function () {

    if (formularioPanel.style.display === "none") {

        formularioPanel.style.display = "block";

        nuevoIngresoBtn.textContent = "Cancelar";

    } else {

        formularioPanel.style.display = "none";

        nuevoIngresoBtn.innerHTML = `
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
            </svg>

            Registrar ingreso
        `;
    }
});

// ==========================================
// OBTENER INGRESOS
// ==========================================

async function cargarIngresos() {

    try {

        const respuesta = await fetch(`${API_URL}/ingresos`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los ingresos");
        }

        const ingresos = await respuesta.json();

        mostrarIngresos(ingresos);

    } catch (error) {

        console.error(error);

        entriesBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No se pudo conectar con el servidor.
                </td>
            </tr>
        `;
    }
}

// ==========================================
// MOSTRAR INGRESOS
// ==========================================

function mostrarIngresos(ingresos) {

    entriesBody.innerHTML = "";

    if (ingresos.length === 0) {

        entriesBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No hay ingresos registrados.
                </td>
            </tr>
        `;

        return;
    }

    ingresos.forEach(function (ingreso) {

        const fila = document.createElement("tr");

        const estadoClase =
            ingreso.estado === "Dentro"
                ? "badge--inside"
                : "badge--out";

        const botonSalida =
            ingreso.estado === "Dentro"
                ? `
                    <button
                        class="btn btn--secondary btn-salida"
                        data-id="${ingreso.id}"
                        type="button"
                    >
                        Registrar salida
                    </button>
                `
                : "";

        fila.innerHTML = `
            <td>
                <div class="person-cell">

                    <span
                        class="person-cell__avatar"
                        aria-hidden="true"
                    ></span>

                    <div>
                        <div class="person-cell__name">
                            ${ingreso.trabajador}
                        </div>

                        <div class="person-cell__meta">
                            ${ingreso.empresa || "Registro manual"}
                        </div>
                    </div>

                </div>
            </td>

            <td>
                <div class="cell-title">
                    ${ingreso.propiedad}
                </div>
            </td>

            <td>
                ${ingreso.actividad}
            </td>

            <td>
                ${ingreso.horaIngreso}
            </td>

            <td>
                ${ingreso.horaSalida || "–"}
            </td>

            <td>
                <span class="badge ${estadoClase}">
                    ${ingreso.estado}
                </span>

                ${botonSalida}
            </td>
        `;

        entriesBody.appendChild(fila);
    });

    agregarEventosSalida();
}

// ==========================================
// REGISTRAR INGRESO
// ==========================================

ingresoForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const trabajador =
        document.getElementById("trabajador").value;

    const propiedad =
        document.getElementById("propiedad").value;

    const actividad =
        document.getElementById("actividad").value;

    try {

        const respuesta = await fetch(`${API_URL}/ingresos`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                trabajador,
                propiedad,
                actividad
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje || "No se pudo registrar el ingreso"
            );
        }

        statusMessage.textContent =
            "Ingreso registrado correctamente.";

        statusMessage.className =
            "status-message success";

        ingresoForm.reset();

        await cargarIngresos();

        setTimeout(function () {

            statusMessage.style.display = "none";

        }, 3000);

    } catch (error) {

        console.error(error);

        statusMessage.textContent =
            error.message;

        statusMessage.className =
            "status-message";

        statusMessage.style.display = "block";
    }
});

// ==========================================
// REGISTRAR SALIDA
// ==========================================

function agregarEventosSalida() {

    const botones =
        document.querySelectorAll(".btn-salida");

    botones.forEach(function (boton) {

        boton.addEventListener("click", async function () {

            const id = boton.dataset.id;

            try {

                const respuesta = await fetch(
                    `${API_URL}/ingresos/${id}/salida`,
                    {
                        method: "PATCH"
                    }
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {

                    throw new Error(
                        datos.mensaje ||
                        "No se pudo registrar la salida"
                    );
                }

                await cargarIngresos();

            } catch (error) {

                console.error(error);

                alert(error.message);
            }
        });
    });
}

// ==========================================
// FILTROS
// ==========================================

function filtrarIngresos() {

    const trabajador =
        buscarTrabajador.value.toLowerCase();

    const propiedad =
        buscarPropiedad.value.toLowerCase();

    const estado =
        buscarEstado.value.toLowerCase();

    const filas =
        entriesBody.querySelectorAll("tr");

    filas.forEach(function (fila) {

        const texto =
            fila.textContent.toLowerCase();

        const coincideTrabajador =
            texto.includes(trabajador);

        const coincidePropiedad =
            texto.includes(propiedad);

        const coincideEstado =
            texto.includes(estado);

        if (
            coincideTrabajador &&
            coincidePropiedad &&
            coincideEstado
        ) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";
        }
    });
}

buscarTrabajador.addEventListener(
    "input",
    filtrarIngresos
);

buscarPropiedad.addEventListener(
    "input",
    filtrarIngresos
);

buscarEstado.addEventListener(
    "change",
    filtrarIngresos
);

// ==========================================
// LIMPIAR FILTROS
// ==========================================

limpiarFiltros.addEventListener(
    "click",
    function () {

        buscarTrabajador.value = "";
        buscarPropiedad.value = "";
        buscarEstado.value = "";

        filtrarIngresos();
    }
);

// ==========================================
// INICIAR
// ==========================================

cargarIngresos();
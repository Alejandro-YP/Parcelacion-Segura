// ==========================================
// Autorización - Vista con localStorage
// ==========================================

const STORAGE_KEY = 'autorizaciones_parcelacion';

const datosIniciales = [
  { id: 1, trabajador: 'Trabajador 01', empresa: 'Empresa A', propiedad: 'Propiedad 05', casa: 'Casa Quinta',   actividad: 'Mantenimiento de jardines', ingreso: '08:15', salida: null, estado: 'dentro' },
  { id: 2, trabajador: 'Trabajador 02', empresa: 'Empresa B', propiedad: 'Propiedad 12', casa: 'Casa Principal', actividad: 'Instalación eléctrica',     ingreso: '09:30', salida: null, estado: 'dentro' }
];

let autorizaciones = JSON.parse(localStorage.getItem(STORAGE_KEY));
if (!autorizaciones) {
  autorizaciones = [...datosIniciales];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(autorizaciones));
}

const tbody       = document.getElementById('tbodyAutorizaciones');
const modal       = document.getElementById('modalNueva');
const form        = document.getElementById('formAutorizacion');
const buscador    = document.getElementById('buscador');
const filtro      = document.getElementById('filtroEstado');
const btnNueva    = document.getElementById('btnNueva');
const btnNueva2   = document.getElementById('btnNueva2');
const btnCancelar = document.getElementById('btnCancelar');

function render() {
  const texto  = buscador.value.toLowerCase().trim();
  const estado = filtro.value;

  const filtradas = autorizaciones.filter(a => {
    const coincideTexto =
      a.trabajador.toLowerCase().includes(texto) ||
      a.propiedad.toLowerCase().includes(texto) ||
      a.actividad.toLowerCase().includes(texto) ||
      (a.empresa || '').toLowerCase().includes(texto);
    const coincideEstado = !estado || a.estado === estado;
    return coincideTexto && coincideEstado;
  });

  tbody.innerHTML = '';

  if (filtradas.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" style="text-align:center; padding: var(--space-6); color: var(--color-ink-faint);">
        No hay autorizaciones que coincidan
      </td></tr>`;
  } else {
    filtradas.forEach(a => {
      const tr = document.createElement('tr');
      const badgeClass =
        a.estado === 'dentro'     ? 'badge--inside'  :
        a.estado === 'activa'     ? 'badge--pending' :
        a.estado === 'finalizada' ? 'badge--out'     : 'badge--out';
      const badgeText =
        a.estado === 'dentro'     ? 'Dentro'     :
        a.estado === 'activa'     ? 'Activa'     :
        a.estado === 'finalizada' ? 'Finalizada' : a.estado;

      let accion = '—';
      if (a.estado === 'activa') {
        accion = `<button class="panel__link" data-action="ingreso" data-id="${a.id}">Registrar ingreso</button>`;
      } else if (a.estado === 'dentro') {
        accion = `<button class="panel__link" style="color: var(--color-status-alert);" data-action="salida" data-id="${a.id}">Registrar salida</button>`;
      }

      tr.innerHTML = `
        <td>
          <div class="person-cell">
            <div class="person-cell__avatar"></div>
            <div>
              <div class="person-cell__name">${a.trabajador}</div>
              <div class="person-cell__meta">${a.empresa || ''}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="cell-title">${a.propiedad}</div>
          <div class="cell-meta">${a.casa || ''}</div>
        </td>
        <td>${a.actividad}</td>
        <td>${a.ingreso || '—'}</td>
        <td>${a.salida || '—'}</td>
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
        <td>${accion}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  actualizarKPIs();
}

function actualizarKPIs() {
  const activas = autorizaciones.filter(a => a.estado === 'activa').length;
  const dentro  = autorizaciones.filter(a => a.estado === 'dentro').length;
  const finales = autorizaciones.filter(a => a.estado === 'finalizada').length;
  const total   = autorizaciones.length;

  document.getElementById('kpiHoy').textContent        = total;
  document.getElementById('kpiActivas').textContent    = activas;
  document.getElementById('kpiPendientes').textContent = dentro;
  document.getElementById('kpiIngresos').textContent   = total;

  document.getElementById('resActivas').textContent = activas;
  document.getElementById('resDentro').textContent  = dentro;
  document.getElementById('resFinal').textContent   = finales;
}

function guardar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(autorizaciones));
}

function abrirModal() {
  document.getElementById('fecha').valueAsDate = new Date();
  modal.classList.add('is-open');
}
function cerrarModal() {
  modal.classList.remove('is-open');
  form.reset();
}

btnNueva.addEventListener('click', abrirModal);
btnNueva2.addEventListener('click', abrirModal);
btnCancelar.addEventListener('click', cerrarModal);
modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });

form.addEventListener('submit', e => {
  e.preventDefault();

  const [trabajador, empresa] = document.getElementById('trabajador').value.split('|');
  const [propiedad, casa]     = document.getElementById('propiedad').value.split('|');
  const actividad             = document.getElementById('actividad').value;

  const nueva = {
    id: Date.now(),
    trabajador, empresa,
    propiedad, casa,
    actividad,
    ingreso: null,
    salida: null,
    estado: 'activa',
    fecha: document.getElementById('fecha').value
  };

  autorizaciones.unshift(nueva);
  guardar();
  render();
  cerrarModal();
});

tbody.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const a  = autorizaciones.find(x => x.id === id);
  if (!a) return;

  const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  if (btn.dataset.action === 'ingreso') {
    a.ingreso = hora;
    a.estado  = 'dentro';
  } else if (btn.dataset.action === 'salida') {
    a.salida = hora;
    a.estado = 'finalizada';
  }

  guardar();
  render();
});

buscador.addEventListener('input', render);
filtro.addEventListener('change', render);

document.getElementById('btnCollapse').addEventListener('click', () => {
  document.getElementById('appShell').classList.toggle('is-collapsed');
});
document.getElementById('btnMenu').addEventListener('click', () => {
  document.getElementById('appShell').classList.toggle('is-collapsed');
});

if (new URLSearchParams(location.search).get('nueva') === '1') {
  abrirModal();
}

render();
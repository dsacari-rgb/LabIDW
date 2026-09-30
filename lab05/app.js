const formTarea = document.querySelector('#form-tarea');
const inputTitulo = document.querySelector('#titulo');
const inputCurso = document.querySelector('#curso');
const inputFecha = document.querySelector('#fecha');
const divAlerta = document.querySelector('#alerta');
const listaTareas = document.querySelector('#lista-tareas');

let tareas = [];

function renderizarTareas() {
    listaTareas.innerHTML = '';

    if (tareas.length === 0) {
        listaTareas.innerHTML = `<li class="list-group-item text-center text-muted">No hay tareas agregadas.</li>`;
        return;
    }

    tareas.forEach((tarea) => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${tarea.completada ? 'bg-light' : ''}`;
        li.dataset.id = tarea.id;
        
        li.innerHTML = `
            <div>
                <span class="${tarea.completada ? 'tarea-completada fw-bold' : 'fw-bold'}">${tarea.titulo}</span>
                <span class="badge bg-secondary ms-1">${tarea.curso}</span>
                <small class="text-muted d-block">Entrega: ${tarea.fechaEntrega}</small>
            </div>
            <div>
                <button class="btn btn-sm ${tarea.completada ? 'btn-warning' : 'btn-success'} me-1 btn-estado">
                    ${tarea.completada ? 'Desmarcar' : 'Completar'}
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
            </div>
        `;

        listaTareas.appendChild(li);
    });
}

listaTareas.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    const idTarea = Number(li.dataset.id);

    // Cambiar estado (completada / pendiente)
    if (e.target.classList.contains('btn-estado')) {
        tareas = tareas.map(t => t.id === idTarea ? { ...t, completada: !t.completada } : t);
        renderizarTareas();
    }

    // Eliminar tarea
    if (e.target.classList.contains('btn-eliminar')) {
        tareas = tareas.filter(t => t.id !== idTarea);
        renderizarTareas();
    }
});

formTarea.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const curso = inputCurso.value.trim();
    const fecha = inputFecha.value;

    if (!titulo || !curso || !fecha) {
        divAlerta.textContent = 'Por favor, completa todos los campos.';
        divAlerta.classList.remove('d-none');
        return;
    }

    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
        divAlerta.textContent = 'La fecha debe ser igual o posterior a la fecha actual.';
        divAlerta.classList.remove('d-none');
        return;
    }

    divAlerta.classList.add('d-none');

    const nuevaTarea = {
        id: Date.now(),
        titulo,
        curso,
        fechaEntrega: fecha,
        completada: false
    };

    tareas.push(nuevaTarea);
    renderizarTareas();
    formTarea.reset();
});
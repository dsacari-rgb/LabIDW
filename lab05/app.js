const formTarea = document.querySelector('#form-tarea');
const inputTitulo = document.querySelector('#titulo');
const inputCurso = document.querySelector('#curso');
const inputFecha = document.querySelector('#fecha');
const divAlerta = document.querySelector('#alerta');

let tareas = [];

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
    console.log('Datos válidos:', { titulo, curso, fecha });
});
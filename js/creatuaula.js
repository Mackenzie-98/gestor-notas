document.addEventListener('DOMContentLoaded', function () {
    let aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    let currentAulaIndex = null;

    function cargarAulas() {
        const listaAulas = document.getElementById('listaAulas');
        listaAulas.innerHTML = '';
        aulas.forEach((aula, index) => {
            listaAulas.appendChild(crearElementoAula(aula, index));
        });

        // Mostrar la lista de estudiantes del aula seleccionada al cargar las aulas
        if (currentAulaIndex !== null) {
            actualizarListaEstudiantes();
        }
    }


    function crearElementoAula(aula, index) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center clickable'; // Agregamos la clase 'clickable' para hacer el elemento cliclable
        li.addEventListener('click', () => seleccionarAula(index)); // Agregamos el evento de clic para seleccionar el aula

        const texto = document.createElement('span');
        texto.textContent = aula.nombre;
        li.appendChild(texto);

        const div = document.createElement('div');
        div.className = 'action-buttons';

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn btn-danger btn-sm btn-icon';
        btnEliminar.innerHTML = '<i class="fas fa-times"></i>';
        btnEliminar.onclick = () => mostrarModalConfirmacion(index);
        div.appendChild(btnEliminar);

        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-warning btn-sm btn-icon';
        btnEditar.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        btnEditar.onclick = () => mostrarModalEditar(index, aula.nombre);
        div.appendChild(btnEditar);

        const btnAgregarEstudiantes = document.createElement('button');
        btnAgregarEstudiantes.className = 'btn btn-info btn-sm btn-icon';
        btnAgregarEstudiantes.innerHTML = '<i class="fas fa-user-plus"></i>';
        btnAgregarEstudiantes.onclick = () => mostrarModalAgregarEstudiantes(index);
        div.appendChild(btnAgregarEstudiantes);

        li.appendChild(div);
        return li;
    }

    function seleccionarAula(index) {
        currentAulaIndex = index;
        const listaAulas = document.getElementById('listaAulas');
        listaAulas.querySelectorAll('.list-group-item').forEach((aula, i) => {
            if (i !== index) {
                aula.classList.add('inactive');
            } else {
                aula.classList.remove('inactive');
            }
        });
        // Aquí se llama a la función para mostrar la lista de estudiantes del aula seleccionada
        mostrarListaEstudiantes(index);
    }

    function mostrarListaEstudiantes(indexAula) {
        currentAulaIndex = indexAula;
        $('#modalListaEstudiantes').modal('show');
        // Aquí actualizas la lista de estudiantes del aula actual
        actualizarListaEstudiantes();
    }



    function mostrarModalConfirmacion(index) {
        $('#modalConfirmarEliminacion').modal('show');

        $('#confirmarEliminacion').off('click').on('click', function () {
            eliminarAula(index);
            $('#modalConfirmarEliminacion').modal('hide');
        });
    }

    function eliminarAula(index) {
        aulas.splice(index, 1);
        localStorage.setItem('aulas', JSON.stringify(aulas));
        cargarAulas();
    }

    function guardarAula(nombreAula) {
        aulas.push({ nombre: nombreAula, estudiantes: [] });
        localStorage.setItem('aulas', JSON.stringify(aulas));
        cargarAulas();
    }

    function editarAula(index, nuevoNombre) {
        aulas[index].nombre = nuevoNombre;
        localStorage.setItem('aulas', JSON.stringify(aulas));
        cargarAulas();
    }

    function mostrarModalEditar(index, nombreAula) {
        $('#editarNombreAula').val(nombreAula);
        $('#modalEditarAula').modal('show');

        $('#formEditarAula').off('submit').on('submit', function (e) {
            e.preventDefault();
            const nuevoNombre = $('#editarNombreAula').val();
            editarAula(index, nuevoNombre);
            $('#modalEditarAula').modal('hide');
        });
    }

    function mostrarModalAgregarEstudiantes(indexAula) {
        currentAulaIndex = indexAula;
        $('#modalAgregarEstudiantes').modal('show');
        actualizarListaEstudiantes();
    }
    let estudiantesAulaActual = []; // Variable global para almacenar la lista de estudiantes del aula actual

    function agregarEstudiante(e) {
        e.preventDefault();
        const puntaje = parseFloat($('#puntaje').val());
        const nota = (puntaje / 100).toFixed(2);

        const estudiante = {
            primerApellido: $('#primerApellido').val(),
            segundoApellido: $('#segundoApellido').val(),
            primerNombre: $('#primerNombre').val(),
            segundoNombre: $('#segundoNombre').val(),
            puntaje: puntaje,
            nota: nota,
        };

        aulas[currentAulaIndex].estudiantes.push(estudiante);
        localStorage.setItem('aulas', JSON.stringify(aulas));

        // Guarda la lista de estudiantes del aula actual en la variable global
        estudiantesAulaActual = aulas[currentAulaIndex].estudiantes;

        $('#formAgregarEstudiante').find("input[type=text], input[type=number]").val("");
        actualizarListaEstudiantes();
    }

    // La función actualizarListaEstudiantes se mantiene igual

    // El resto de tu código permanece sin cambios

    function actualizarListaEstudiantes() {
        const listaEstudiantes = document.getElementById('listaEstudiantes');
        listaEstudiantes.innerHTML = '';
        if (currentAulaIndex !== null) {
            aulas[currentAulaIndex].estudiantes.forEach((estudiante, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${estudiante.primerApellido}</td>
                    <td>${estudiante.segundoApellido}</td>
                    <td>${estudiante.primerNombre}</td>
                    <td>${estudiante.segundoNombre}</td>
                    <td>${estudiante.puntaje}</td>
                    <td>${estudiante.nota}</td>
                    <td><!-- Aquí puedes agregar acciones si lo deseas --></td>
                `;
                listaEstudiantes.appendChild(tr);
            });
        }
    }



    document.getElementById('formCrearAula').addEventListener('submit', function (e) {
        e.preventDefault();
        const nombreAula = document.getElementById('nombreAula').value.trim();
        if (nombreAula) {
            guardarAula(nombreAula);
            document.getElementById('nombreAula').value = '';
            $('#modalCrearAula').modal('hide');
        }
    });

    // Continuing from the 'formAgregarEstudiante' setup
    document.getElementById('formAgregarEstudiante').addEventListener('submit', agregarEstudiante);

    // Ensure all classrooms are loaded and displayed when the page is loaded
    cargarAulas();
});

// Esta es la función para guardar nuevas aulas, ajustada para no duplicar código.
function guardarAula(nombreAula) {
    let aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    let nuevaAula = { nombre: nombreAula, estudiantes: [] };
    aulas.push(nuevaAula);
    localStorage.setItem('aulas', JSON.stringify(aulas));
    cargarAulas(); // Vuelve a cargar la lista de aulas para mostrar la nueva aula.
}

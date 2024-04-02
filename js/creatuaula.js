document.addEventListener('DOMContentLoaded', function () {
    let aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    let currentAulaIndex = null;

    function cargarAulas() {
        const listaAulas = document.getElementById('listaAulas');
        listaAulas.innerHTML = '';
        aulas.forEach((aula, index) => {
            listaAulas.appendChild(crearElementoAula(aula, index));
        });
    }

    function crearElementoAula(aula, index) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

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

    function mostrarModalConfirmacion(index) {
        $('#modalConfirmarEliminacion').modal('show');

        $('#confirmarEliminacion').off('click').on('click', function() {
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

    function agregarEstudiante(e) {
        e.preventDefault();
        const estudiante = {
            primerApellido: $('#primerApellido').val(),
            segundoApellido: $('#segundoApellido').val(),
            primerNombre: $('#primerNombre').val(),
            segundoNombre: $('#segundoNombre').val(),
            puntaje: $('#puntaje').val(),
        };

        aulas[currentAulaIndex].estudiantes.push(estudiante);
        localStorage.setItem('aulas', JSON.stringify(aulas));
        $('#formAgregarEstudiante').find("input[type=text], input[type=number]").val("");
        actualizarListaEstudiantes();
    }

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

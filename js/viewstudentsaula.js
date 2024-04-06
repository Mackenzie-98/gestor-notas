document.addEventListener('DOMContentLoaded', function () {
    const selectedAulaIndex = localStorage.getItem('selectedAulaIndex');
    const aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    let estudiantes = (aulas[selectedAulaIndex] || {}).estudiantes || [];
    let estudianteSeleccionado = null;

    function actualizarAlmacenamiento() {
        localStorage.setItem('aulas', JSON.stringify(aulas));
    }

    const tabla = document.getElementById('tablaEstudiantes');
    estudiantes.forEach((estudiante, index) => {
        if (!estudiante.historial) {
            estudiante.historial = []; // Asegurarse de que cada estudiante tenga un historial
        }

        let fila = tabla.insertRow();
        fila.insertCell(0).innerHTML = index + 1;
        fila.insertCell(1).innerHTML = estudiante.primerApellido;
        fila.insertCell(2).innerHTML = estudiante.segundoApellido;
        fila.insertCell(3).innerHTML = estudiante.primerNombre;
        fila.insertCell(4).innerHTML = estudiante.segundoNombre;
        fila.insertCell(5).innerHTML = estudiante.puntaje;
        fila.insertCell(6).innerHTML = estudiante.nota; // Asumiendo que la nota ya está calculada
        let botonHistorial = document.createElement('button');
        botonHistorial.textContent = 'Ver Historial';
        botonHistorial.className = 'btn btn-info btn-sm';
        botonHistorial.onclick = function () {
            mostrarHistorial(estudiante);
        };
        fila.insertCell(7).appendChild(botonHistorial);
        fila.setAttribute('data-id', estudiante.id);

        fila.addEventListener('click', function () {
            estudianteSeleccionado = estudiante;
            document.querySelectorAll('#tablaEstudiantes tr').forEach(row => row.classList.remove('table-primary'));
            fila.classList.add('table-primary');
        });
    });

    window.modificarPuntaje = function (cambio) {
        if (!estudianteSeleccionado) {
            alert('Por favor, seleccione un estudiante.');
            return;
        }

        const motivo = prompt('Ingrese el motivo del cambio de puntaje:');
        if (!motivo) return;

        estudianteSeleccionado.puntaje += cambio;
        estudianteSeleccionado.historial.push({ cambio, motivo, fecha: new Date().toLocaleString() });
        // Aquí se debe actualizar la nota en función del nuevo puntaje, si aplicable
        // Por ejemplo: estudianteSeleccionado.nota = <nueva nota calculada>;

        actualizarAlmacenamiento();
        location.reload(); // Recargar la página para actualizar la tabla
    };

    window.mostrarHistorial = function (estudiante) {
        $('#modalHistorial').modal('show');
        const listaHistorial = document.getElementById('listaHistorial');
        listaHistorial.innerHTML = '';
        estudiante.historial.forEach(item => {
            let li = document.createElement('li');
            li.textContent = `${item.fecha}: ${item.cambio > 0 ? '+' : ''}${item.cambio} puntos. Motivo: ${item.motivo}`;
            listaHistorial.appendChild(li);
        });
    };
});

// Manejador de clic para el botón de inicio
const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', function () {
    window.location.href = 'dashboard.html'; // Asegúrate de que el nombre del archivo de inicio sea correcto
});
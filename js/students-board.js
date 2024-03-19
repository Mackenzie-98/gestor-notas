let estudianteSeleccionado = null;




document.addEventListener('DOMContentLoaded', function () {
    function actualizarAlmacenamiento() {
        localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
    }

    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [
        { id: 1, primerApellido: 'López', segundoApellido: 'Pérez', primerNombre: 'Juan', segundoNombre: 'Carlos', puntaje: 500, historial: [] },
        { id: 2, primerApellido: 'Martínez', segundoApellido: 'Sanchez', primerNombre: 'Laura', segundoNombre: 'Patricia', puntaje: 500, historial: [] },
        { id: 3, primerApellido: 'García', segundoApellido: 'Dominguez', primerNombre: 'Pedro', segundoNombre: 'Luis', puntaje: 500, historial: [] },
        { id: 4, primerApellido: 'Rodríguez', segundoApellido: 'Gomez', primerNombre: 'María', segundoNombre: 'Fernanda', puntaje: 500, historial: [] },
        { id: 5, primerApellido: 'González', segundoApellido: 'López', primerNombre: 'Andrés', segundoNombre: 'Miguel', puntaje: 500, historial: [] },
        { id: 6, primerApellido: 'Pérez', segundoApellido: 'Martínez', primerNombre: 'Ana', segundoNombre: 'Sofía', puntaje: 500, historial: [] },
        { id: 7, primerApellido: 'Sanchez', segundoApellido: 'García', primerNombre: 'Luis', segundoNombre: 'Alberto', puntaje: 500, historial: [] },
    ];


    const tabla = document.getElementById('tablaEstudiantes');
    estudiantes.forEach(estudiante => {
        let fila = tabla.insertRow();
        fila.insertCell(0).innerHTML = estudiante.id;
        fila.insertCell(1).innerHTML = estudiante.primerApellido;
        fila.insertCell(2).innerHTML = estudiante.segundoApellido;
        fila.insertCell(3).innerHTML = estudiante.primerNombre;
        fila.insertCell(4).innerHTML = estudiante.segundoNombre;
        fila.insertCell(5).innerHTML = estudiante.puntaje;
        let botonHistorial = fila.insertCell(6).appendChild(document.createElement('button'));
        botonHistorial.textContent = 'Ver Historial';
        botonHistorial.onclick = function (event) {
            event.stopPropagation(); // Evitar que el evento click de la fila se dispare al hacer clic en "Ver Historial"
            mostrarHistorial(estudiante);
        };
        fila.setAttribute('data-id', estudiante.id);

        // Evento click para seleccionar estudiante
        fila.addEventListener('click', function () {
            estudianteSeleccionado = estudiante;
            document.querySelectorAll('#tablaEstudiantes tr').forEach(row => row.classList.remove('table-primary'));
            fila.classList.add('table-primary'); // Resaltar fila seleccionada
        });
    });

    window.modificarPuntaje = function (cambio) {
        const motivo = prompt('Ingrese el motivo:');
        if (!estudianteSeleccionado || !motivo) {
            alert('Por favor, seleccione un estudiante e ingrese un motivo.');
            return;
        }

        // Actualizamos directamente el estudiante en el array 'estudiantes' para mantener la coherencia de datos
        const estudianteActualizado = estudiantes.find(e => e.id === estudianteSeleccionado.id);
        if (estudianteActualizado) {
            estudianteActualizado.puntaje += cambio;
            estudianteActualizado.historial.push({ cambio, motivo, fecha: new Date().toLocaleString() });
            document.querySelector(`tr[data-id='${estudianteActualizado.id}']`).cells[5].innerHTML = estudianteActualizado.puntaje;
            actualizarAlmacenamiento(); // Asegurarse de llamar a la función correctamente
        }
    };

    window.mostrarHistorial = function (estudiante) {
        $('#modalHistorial').modal({
            backdrop: false, // Esto deshabilitará el backdrop
            keyboard: true // Permite cerrar el modal con la tecla Esc
        });
        const listaHistorial = document.getElementById('listaHistorial');
        listaHistorial.innerHTML = ''; // Limpiar historial anterior
        (estudiante.historial || []).forEach(item => {
            let li = document.createElement('li');
            li.textContent = `${item.fecha}: ${item.cambio > 0 ? '+' : ''}${item.cambio} puntos. Motivo: ${item.motivo}`;
            listaHistorial.appendChild(li);
        });
        $('#modalHistorial').modal('show');
    };
});

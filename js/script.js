let estudianteSeleccionado = null;

document.addEventListener('DOMContentLoaded', function () {
    const estudiantes = [
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
        if (!estudianteSeleccionado) {
            alert('Por favor, seleccione un estudiante.');
            return;
        }
        if (motivo) {
            estudianteSeleccionado.puntaje += cambio;
            estudianteSeleccionado.historial.push({ cambio, motivo, fecha: new Date().toLocaleString() });
            document.querySelector(`tr[data-id='${estudianteSeleccionado.id}']`).cells[5].innerHTML = estudianteSeleccionado.puntaje;
        }
    };

    window.mostrarHistorial = function (estudiante) {
        const modal = document.getElementById('modalHistorial');
        const listaHistorial = document.getElementById('listaHistorial');
        listaHistorial.innerHTML = ''; // Limpiar historial anterior
        estudiante.historial.forEach(item => {
            let li = document.createElement('li');
            li.textContent = `${item.fecha}: ${item.cambio > 0 ? '+' : ''}${item.cambio} puntos. Motivo: ${item.motivo}`;
            listaHistorial.appendChild(li);
        });
        modal.style.display = 'block';

        document.querySelector('.close').onclick = function () {
            modal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    };
});

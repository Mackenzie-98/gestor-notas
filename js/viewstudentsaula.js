document.addEventListener('DOMContentLoaded', function () {
    const selectedAulaIndex = localStorage.getItem('selectedAulaIndex');
    const aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    let estudiantes = (aulas[selectedAulaIndex] || {}).estudiantes || [];
    let estudianteSeleccionado = null;
    let estudiantesSeleccionados = [];

    function actualizarAlmacenamiento() {
        localStorage.setItem('aulas', JSON.stringify(aulas));
    }

    const comportamientosGuardados = JSON.parse(localStorage.getItem('comportamientos') || '[]');
comportamientosGuardados.forEach((comportamiento, index) => {
    agregarBotonComportamiento(comportamiento.motivo, comportamiento.puntos, false, index); // Asumiendo que modificas la función para aceptar un índice o identificador único
});

    document.getElementById('formAgregarComportamiento').addEventListener('submit', function(event) {
        event.preventDefault();
        const motivo = document.getElementById('motivo').value;
        const puntos = parseInt(document.getElementById('puntos').value, 10);

        agregarBotonComportamiento(motivo, puntos, true);

        $('#modalAgregarComportamiento').modal('hide'); // Cierra el modal
    });

    function agregarBotonComportamiento(motivo, puntos, guardar) {
        const panelAdmin = document.querySelector('.panel');
        const contenedor = document.createElement('div');
        contenedor.className = 'd-flex justify-content-between align-items-center boton-comportamiento-container';
    
        const boton = document.createElement('button');
        boton.className = `btn ${puntos >= 0 ? 'btn-outline-success' : 'btn-outline-danger'} mb-2 boton-comportamiento`;
        boton.innerHTML = `<span class="badge badge-light">${puntos >= 0 ? '+' : ''}${puntos} puntos</span> ${motivo}`;
    
        boton.onclick = function() {
            if (!estudianteSeleccionado) {
                alert('Por favor, seleccione un estudiante.');
                return;
            }
            const confirmMotivo = prompt('Ingrese el motivo del cambio de puntaje:'); // Solicita motivo si es necesario
            modificarPuntaje(estudianteSeleccionado, puntos, confirmMotivo || motivo);
        };
    
        // Botón para eliminar el comportamiento
            const botonEliminar = document.createElement('button');
            botonEliminar.className = 'btn btn-outline-danger ml-2';
            botonEliminar.innerHTML = '<i class="fas fa-trash"></i>';

            botonEliminar.onclick = function() {
                // Elimina el comportamiento de la interfaz
                panelAdmin.removeChild(contenedor);

                // Encuentra y elimina el comportamiento de localStorage
                const comportamientos = JSON.parse(localStorage.getItem('comportamientos') || '[]');
                const index = comportamientos.findIndex(c => c.motivo === motivo && c.puntos === puntos);
                if (index > -1) {
                    comportamientos.splice(index, 1);
                    localStorage.setItem('comportamientos', JSON.stringify(comportamientos));
                }
            };
        
    
        contenedor.appendChild(boton);
        contenedor.appendChild(botonEliminar);
        panelAdmin.appendChild(contenedor);
    
        if (guardar) {
            // Guarda el comportamiento en localStorage para persistencia entre recargas
            const comportamientos = JSON.parse(localStorage.getItem('comportamientos') || '[]');
            comportamientos.push({ motivo, puntos });
            localStorage.setItem('comportamientos', JSON.stringify(comportamientos));
        }
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

    function modificarPuntaje(estudiante, puntos, motivo) {
        // Asegúrate de que el estudiante y motivo son válidos
        if (!estudiante || !motivo) {
            alert('Por favor, asegúrese de que ha seleccionado un estudiante y ha ingresado un motivo.');
            return;
        }
    
        // Incrementa el puntaje basado en el cambio proporcionado y recalcula la nota
        estudiante.puntaje += puntos;
        estudiante.nota = (estudiante.puntaje / 100).toFixed(2);
    
        // Registra el cambio en el historial del estudiante
        estudiante.historial.push({
            cambio: puntos,
            motivo: motivo,
            fecha: new Date().toLocaleString()
        });
    
        // Actualiza el almacenamiento local con el cambio
        actualizarAlmacenamiento();
        // Recargar la página para reflejar los cambios en la UI
        location.reload();
    }
    

    window.modificarPuntaje = function (cambio) {
        if (!estudianteSeleccionado) {
            alert('Por favor, seleccione un estudiante.');
            return;
        }
    
        const motivo = prompt('Ingrese el motivo del cambio de puntaje:');
        if (!motivo) return;
    
        // Incrementa el puntaje basado en el cambio proporcionado
        estudianteSeleccionado.puntaje += cambio;
        // Calcula la nueva nota dividiendo el puntaje actualizado por 100
        estudianteSeleccionado.nota = (estudianteSeleccionado.puntaje / 100).toFixed(2);
    
        // Registra el cambio en el historial del estudiante
        estudianteSeleccionado.historial.push({
            cambio,
            motivo,
            fecha: new Date().toLocaleString()
        });
    
        // Actualiza el almacenamiento local con el cambio
        actualizarAlmacenamiento();
        // Recarga la página para reflejar los cambios en la UI
        location.reload();
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
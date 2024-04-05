document.addEventListener('DOMContentLoaded', function() {
    const aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    const listaAulas = document.getElementById('listaAulas');

    // Verificar si hay aulas almacenadas
    if (!aulas.length) {
        listaAulas.innerHTML = '<p class="text-center">No hay aulas creadas aún.</p>';
        return;
    }

    // Crear y añadir las cards de aulas al contenedor
    aulas.forEach((aula, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.width = '18rem';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${aula.nombre}</h5>
                <p class="card-text">Estudiantes: ${aula.estudiantes.length}</p>
                <a href="#" class="btn btn-primary" onclick="mostrarEstudiantes(${index})">Ver Estudiantes</a>
            </div>
        `;
        listaAulas.appendChild(card);
    });
});

function mostrarEstudiantes(index) {
    const aulas = JSON.parse(localStorage.getItem('aulas')) || [];
    const aula = aulas[index];
    alert(`Estudiantes en ${aula.nombre}: ${aula.estudiantes.length}`);
    // Implementa la lógica para mostrar los detalles de los estudiantes
    // Esto puede incluir mostrar un modal con la lista de estudiantes
}

document.addEventListener('DOMContentLoaded', function () {
    // Evento click para la tarjeta "Estudiantes"
    document.querySelector('.estudiantes-card').addEventListener('click', function () {
        window.open('../pages/students-board.html', '_blank');
    });

    // Evento click para la tarjeta "Crea tu Aula de Clases"
    document.querySelector('.aula-card').addEventListener('click', function () {
        window.open('creatuaula.html', '_blank'); // Asegúrate de que esta ruta sea correcta
    });

    // Aquí puedes agregar más código JS para otros eventos onclick según necesites
});


document.addEventListener('DOMContentLoaded', function () {
    // Agregar evento click a la tarjeta "Estudiantes"
    document.querySelector('.estudiantes-card').addEventListener('click', function () {
        window.open('../pages/students-board.html', '_blank');
    });

    // Aquí puedes agregar el resto de tu código JS para otros eventos onclick
});
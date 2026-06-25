const tiempoMaximoInactividad = 2 * 60 * 1000; // 2 minutos
function actualizarActividad() {

    localStorage.setItem(
        'ultimaActividad',
        Date.now()
    );

}
// Detectar actividad del usuario
document.addEventListener('mousemove', actualizarActividad);
document.addEventListener('click', actualizarActividad);
document.addEventListener('keydown', actualizarActividad);
document.addEventListener('scroll', actualizarActividad);
function verificarSesion() {
    const token = localStorage.getItem('token');
    const ultimaActividad = localStorage.getItem('ultimaActividad');
    if (!token) {

        alert('Debe iniciar sesión');

        window.location.href = '/Auth/Login/Inicio.html';
        return;

    }

    if (!ultimaActividad) {

        localStorage.setItem(
            'ultimaActividad',
            Date.now()
        );

        return;
    }

    const tiempoInactivo = Date.now() - Number(ultimaActividad);
    if (tiempoInactivo > tiempoMaximoInactividad) {
        localStorage.removeItem('token');
        localStorage.removeItem('ultimaActividad');
        alert('La sesión ha expirado por inactividad');
        window.location.href = '/Auth/Login/Inicio.html';
    }
}
// Verificar al cargar la página
verificarSesion();
// Revisar cada 10 segundos
setInterval(verificarSesion, 10000);
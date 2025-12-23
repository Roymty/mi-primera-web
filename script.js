document.addEventListener('DOMContentLoaded', function() {
    // 1. GESTIÓN DE LA FECHA
    const fechaEl = document.getElementById('fecha-evento');
    const hoy = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    fechaEl.textContent = hoy.toLocaleDateString('es-ES', opciones);

    // 2. LÓGICA DE NOMBRES (URL o LocalStorage)
    const params = new URLSearchParams(window.location.search);
    let invitadoURL = params.get('inv');
    let remitenteURL = params.get('rem');

    // Si vienen en el link, los usamos. Si no, buscamos en la "base de datos" local
    const invitadoFinal = invitadoURL || localStorage.getItem('invitado') || "Invitado";
    const remitenteFinal = remitenteURL || localStorage.getItem('remitente') || "Anfitrión";

    document.getElementById('nombre-invitado').textContent = invitadoFinal;
    document.getElementById('nombre-remitente').textContent = remitenteFinal;
});

function guardarYGenerar() {
    const inv = document.getElementById('input-invitado').value;
    const rem = document.getElementById('input-remitente').value;

    if (inv === "" || rem === "") {
        alert("Por favor escribe ambos nombres.");
        return;
    }

    // Guardar en la base de datos del navegador
    localStorage.setItem('invitado', inv);
    localStorage.setItem('remitente', rem);

    // Actualizar la vista actual
    document.getElementById('nombre-invitado').textContent = inv;
    document.getElementById('nombre-remitente').textContent = rem;

    // Generar link para compartir
    const urlBase = window.location.origin + window.location.pathname;
    const linkFinal = `${urlBase}?inv=${encodeURIComponent(inv)}&rem=${encodeURIComponent(rem)}`;
    
    const cajaLink = document.getElementById('contenedor-link');
    const inputLink = document.getElementById('link-resultado');
    
    cajaLink.style.display = 'block';
    inputLink.value = linkFinal;

    alert("¡Guardado! Ahora puedes copiar el link de abajo.");
}

function borrarTodo() {
    if (confirm("¿Quieres borrar los nombres de la base de datos?")) {
        localStorage.clear();
        // Limpiamos la URL quitando los parámetros
        window.location.href = window.location.origin + window.location.pathname;
    }
}

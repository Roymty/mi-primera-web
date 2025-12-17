const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const respuesta = document.getElementById("respuesta");

// Cuando presiona SÍ
btnSi.addEventListener("click", () => {
    localStorage.setItem("respuestaInvitacion", "Sí");
    respuesta.textContent = "💖 Gracias por aceptar, me hará mucha ilusión.";
});

// Cuando presiona NO
btnNo.addEventListener("click", () => {
    localStorage.setItem("respuestaInvitacion", "No");
    respuesta.textContent = "✨ Gracias por tu sinceridad.";
});






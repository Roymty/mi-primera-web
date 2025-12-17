function ocultarBotones()// {//
    btnSi.style.display = "none";//
    btnNo.style.display = "none";//
}//
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const respuesta = document.getElementById("respuesta");

btnSi.addEventListener("click", () => {
    localStorage.setItem("respuestaInvitacion", "Sí");
    respuesta.textContent = "💖 Gracias por aceptar, me hará mucha ilusión.";
    ocultarBotones();
});

btnNo.addEventListener("click", () => {
    localStorage.setItem("respuestaInvitacion", "No");
    respuesta.textContent = "✨ Gracias por tu sinceridad.";
    ocultarBotones();
});

const respuestaGuardada = localStorage.getItem("respuestaInvitacion");

if (respuestaGuardada === "Sí") {
    respuesta.textContent = "💖 Ella aceptó la invitación.";
    ocultarBotones();
}

if (respuestaGuardada === "No") {
    respuesta.textContent = "✨ Ella respondió que no.";
    ocultarBotones();
}









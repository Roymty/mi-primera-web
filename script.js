//function ocultarBotones() {
    //btnSi.style.display = "none";
   // btnNo.style.display = "none";
//}
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const respuesta = document.getElementById("respuesta");

btnSi.addEventListener("click", () => {
    localStorage.setItem("respuestaInvitacion", "Sí");
    respuesta.textContent = "💖 Ella respondió: Sí";
});

btnNo.addEventListener("click", () => {
    localStorage.setItem("respuestaInvitacion", "No");
    respuesta.textContent = "✨ Ella respondió: No";
});


const respuestaGuardada = localStorage.getItem("respuestaInvitacion");

if (respuestaGuardada) {
    respuesta.textContent = "📌 Respuesta guardada: " + respuestaGuardada;
}












const btnTexto = document.getElementById("btnTexto");
const btnMostrar = document.getElementById("btnMostrar");
const btnColor = document.getElementById("btnColor");

const mensaje = document.getElementById("mensaje");
const extra = document.getElementById("extra");
const contenedor = document.querySelector(".contenedor");

btnTexto.addEventListener("click", () => {
    mensaje.textContent = "¡Texto cambiado con evento profesional!";
});

btnMostrar.addEventListener("click", () => {
    extra.style.display = extra.style.display === "none" ? "block" : "none";
});

btnColor.addEventListener("click", () => {
    contenedor.style.backgroundColor =
        contenedor.style.backgroundColor === "white" ? "#f3e8ff" : "white";
});





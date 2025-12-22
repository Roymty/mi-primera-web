import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: "AIzaSyDouWz1WV4-k2b2g_S0j_o746_8dHZPtGE",
  authDomain: "invitacion-web-84d4f.firebaseapp.com",
  projectId: "invitacion-web-84d4f",
  storageBucket: "invitacion-web-84d4f.firebasestorage.app",
  messagingSenderId: "743465964686",
  appId: "1:743465964686:web:f9dca07e62862fe47ee5df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= ELEMENTOS ================= */

const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const mensaje = document.getElementById("mensaje");
const mensajeFinal = document.getElementById("mensajeFinal");
const mensajeNo = document.getElementById("mensajeNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const card = document.querySelector(".card");

/* ================= MENSAJE VISUAL ================= */

function mostrarGracias() {
  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;

  btnSi.style.display = "none";
  btnNo.style.display = "none";

  setTimeout(() => {
    mensaje.style.opacity = 0;
  }, 1000);
}

/* ================= BOTÓN SÍ ================= */

btnSi.addEventListener("click", () => {
  mostrarGracias();

  card.classList.add("compacta");
  invitacion.style.display = "none";

  setTimeout(() => {
    formulario.classList.remove("oculto");
    mensajeFinal.style.opacity = 1;
  }, 300);
});

/* ================= BOTÓN NO ================= */

btnNo.addEventListener("click", async () => {
  mostrarGracias();

  await addDoc(collection(db, "detalles"), {
    respuesta: "No",
    fecha: new Date()
  });

  card.classList.add("compacta");
  invitacion.style.display = "none";

  setTimeout(() => {
    mensajeNo.classList.remove("oculto");
    mensajeNo.style.opacity = 1;
  }, 300);
});

/* ================= FORMULARIO (SÍ + DETALLES) ================= */

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "detalles"), {
    respuesta: "Sí",
    comida: comida.value,
    lugar: lugar.value,
    comentario: comentario.value,
    fecha: new Date()
  });

  formulario.querySelectorAll("input, textarea, button").forEach(el => {
    el.style.display = "none";
  });

  mensajeFinal.textContent = "Gracias, lo tomaré en cuenta 😊";
  mensajeFinal.style.opacity = 1;
});

/* ===== CONFIGURACIÓN DE NOMBRES ===== */

const txtInvitador = document.getElementById("txtInvitador");
const txtInvitada = document.getElementById("txtInvitada");

const nombreInvitadorInput = document.getElementById("nombreInvitador");
const nombreInvitadaInput = document.getElementById("nombreInvitada");
const guardarNombres = document.getElementById("guardarNombres");

const configToggle = document.getElementById("configToggle");
const configPanel = document.getElementById("configPanel");

/* Mostrar / ocultar panel */
configToggle.addEventListener("click", () => {
  configPanel.style.display =
    configPanel.style.display === "block" ? "none" : "block";
});

/* Guardar nombres */
guardarNombres.addEventListener("click", () => {
  localStorage.setItem("invitador", nombreInvitadorInput.value);
  localStorage.setItem("invitada", nombreInvitadaInput.value);
  cargarNombres();
});

/* Cargar nombres */
function cargarNombres() {
  const invitador = localStorage.getItem("invitador") || "";
  const invitada = localStorage.getItem("invitada") || "";

  txtInvitador.textContent = invitador;
  txtInvitada.textContent = invitada;

  nombreInvitadorInput.value = invitador;
  nombreInvitadaInput.value = invitada;
}

/* Ejecutar al cargar */
cargarNombres();

/* ================= ADMIN ================= */

const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const verDatos = document.getElementById("verDatos");
const resultadoAdmin = document.getElementById("resultadoAdmin");
const adminPass = document.getElementById("adminPass");

adminToggle.addEventListener("click", () => {
  adminPanel.style.display =
    adminPanel.style.display === "block" ? "none" : "block";
});

verDatos.addEventListener("click", async () => {
  if (adminPass.value !== "1234") {
    resultadoAdmin.textContent = "Acceso denegado";
    return;
  }

  resultadoAdmin.innerHTML = "<strong>Respuestas:</strong><br><br>";

  const datos = await getDocs(collection(db, "detalles"));

  datos.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `
      🗳️ ${d.respuesta}<br>
      ${d.comida ? `🍽️ ${d.comida}<br>` : ""}
      ${d.lugar ? `📍 ${d.lugar}<br>` : ""}
      ${d.comentario ? `💬 ${d.comentario}<br>` : ""}
      📅 ${d.fecha?.toDate?.().toLocaleString() || ""}
      <hr>
    `;
  });
});


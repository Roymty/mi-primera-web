import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 FIREBASE CONFIG REAL */
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

/* ELEMENTOS */
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const mensaje = document.getElementById("mensaje");
const mensajeNo = document.getElementById("mensajeNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const acciones = document.getElementById("acciones");

/* GUARDAR RESPUESTA */
async function guardarRespuesta(respuesta) {
  await addDoc(collection(db, "respuestas"), {
    respuesta,
    fecha: new Date()
  });

  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;
  acciones.style.display = "none";
}

/* BOTÓN SÍ */
btnSi.addEventListener("click", async () => {
  await guardarRespuesta("Sí");
  invitacion.style.display = "none";
  formulario.classList.remove("oculto");
});

/* BOTÓN NO */
btnNo.addEventListener("click", async () => {
  await guardarRespuesta("No");
  invitacion.style.display = "none";
  mensajeNo.classList.remove("oculto");
});

/* FORMULARIO */
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "detalles"), {
    comida: comida.value,
    lugar: lugar.value,
    comentario: comentario.value,
    fecha: new Date()
  });

  formulario.innerHTML = "<p>Gracias, lo tomaré en cuenta 😊</p>";
});

/* ADMIN */
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

  const respuestas = await getDocs(collection(db, "respuestas"));
  respuestas.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `• ${d.respuesta}<br>`;
  });

  resultadoAdmin.innerHTML += "<hr><strong>Detalles:</strong><br><br>";

  const detalles = await getDocs(collection(db, "detalles"));
  detalles.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `
      🍽 ${d.comida}<br>
      📍 ${d.lugar}<br>
      💬 ${d.comentario || "—"}<br><br>
    `;
  });
});

/* CONFIG NOMBRES */
function cargarNombres() {
  txtInvitador.textContent = localStorage.getItem("invitador") || "";
  txtInvitada.textContent = localStorage.getItem("invitada") || "";
  nombreInvitador.value = txtInvitador.textContent;
  nombreInvitada.value = txtInvitada.textContent;
}

guardarNombres.addEventListener("click", () => {
  localStorage.setItem("invitador", nombreInvitador.value);
  localStorage.setItem("invitada", nombreInvitada.value);
  cargarNombres();
});

configToggle.addEventListener("click", () => {
  configPanel.style.display =
    configPanel.style.display === "block" ? "none" : "block";
});

cargarNombres();

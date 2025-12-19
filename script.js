import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 FIREBASE CONFIG */
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
const mensajeFinal = document.getElementById("mensajeFinal");
const mensajeNo = document.getElementById("mensajeNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const card = document.querySelector(".card");

/* GUARDAR RESPUESTA */
async function guardarRespuesta(respuesta) {
  await addDoc(collection(db, "respuestas"), {
    respuesta,
    fecha: new Date()
  });

  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;

  setTimeout(() => {
    mensaje.classList.add("desaparecer");
  }, 1200);

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 1800);

  btnSi.style.display = "none";
  btnNo.style.display = "none";
}

/* BOTÓN SÍ */
btnSi.addEventListener("click", async () => {
  await guardarRespuesta("Sí");

  invitacion.classList.add("desaparecer");

  // 👉 HACE LA TARJETA MÁS PEQUEÑA
  card.classList.add("compacta");

  setTimeout(() => {
    mensajeFinal.classList.remove("oculto");
    formulario.classList.remove("oculto");
  }, 600);
});

/* BOTÓN NO */
btnNo.addEventListener("click", async () => {
  await guardarRespuesta("No");

  invitacion.classList.add("desaparecer");

  setTimeout(() => {
    mensajeNo.classList.remove("oculto");
  }, 600);
});

/* FORMULARIO */
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "detalles"), {
    comida: document.getElementById("comida").value,
    lugar: document.getElementById("lugar").value,
    comentario: document.getElementById("comentario").value,
    fecha: new Date()
  });

  mensajeFinal.classList.add("oculto");
  formulario.innerHTML = "<p>Gracias, lo tomaré en cuenta 😊</p>";
});

/* ================= ADMIN ================= */

const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const verDatos = document.getElementById("verDatos");
const resultadoAdmin = document.getElementById("resultadoAdmin");

adminToggle.addEventListener("click", () => {
  adminPanel.style.display =
    adminPanel.style.display === "block" ? "none" : "block";
});

verDatos.addEventListener("click", async () => {
  if (document.getElementById("adminPass").value !== "1234") {
    resultadoAdmin.textContent = "Acceso denegado";
    return;
  }

  resultadoAdmin.innerHTML = "<strong>Respuestas</strong><br><br>";

  const respuestas = await getDocs(collection(db, "respuestas"));
  respuestas.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `• Respuesta: ${d.respuesta}<br>`;
  });

  resultadoAdmin.innerHTML += "<hr><strong>Detalles</strong><br><br>";

  const detalles = await getDocs(collection(db, "detalles"));
  detalles.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `
      🍽️ ${d.comida}<br>
      📍 ${d.lugar}<br>
      💬 ${d.comentario || "—"}<br><br>
    `;
  });
});











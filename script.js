import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
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

/* ================= RESET UI ================= */

function resetUI() {
  mensaje.textContent = "";
  mensaje.style.opacity = 0;

  mensajeFinal.classList.add("oculto");
  mensajeNo.classList.add("oculto");
  formulario.classList.add("oculto");

  btnSi.style.display = "inline-block";
  btnNo.style.display = "inline-block";

  invitacion.style.display = "block";
  card.classList.remove("compacta");
}

resetUI();

/* ================= BOTÓN SÍ ================= */

btnSi.addEventListener("click", async () => {
  await addDoc(collection(db, "respuestas"), {
    respuesta: "Sí",
    fecha: serverTimestamp()
  });

  btnSi.style.display = "none";
  btnNo.style.display = "none";
  invitacion.style.display = "none";

  mensaje.textContent = "";
  mensaje.style.opacity = 0;

  setTimeout(() => {
    card.classList.add("compacta");
    mensajeFinal.classList.remove("oculto");
    formulario.classList.remove("oculto");
  }, 300);
});

/* ================= BOTÓN NO ================= */

btnNo.addEventListener("click", async () => {
  await addDoc(collection(db, "respuestas"), {
    respuesta: "No",
    fecha: serverTimestamp()
  });

  btnSi.style.display = "none";
  btnNo.style.display = "none";
  invitacion.style.display = "none";

  mensajeFinal.classList.add("oculto");

  setTimeout(() => {
    mensajeNo.classList.remove("oculto");
  }, 300);
});

/* ================= FORMULARIO ================= */

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "detalles"), {
    comida: document.getElementById("comida").value,
    lugar: document.getElementById("lugar").value,
    comentario: document.getElementById("comentario").value,
    fecha: serverTimestamp()
  });

  formulario.reset();
  formulario.classList.add("oculto");

  mensajeFinal.textContent = "Gracias, lo tomaré en cuenta 😊";
  mensajeFinal.classList.remove("oculto");
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

  resultadoAdmin.innerHTML = "<strong>📊 Respuestas</strong><br><br>";

  const respuestas = await getDocs(collection(db, "respuestas"));
  respuestas.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `✔️ ${d.respuesta}<br>`;
  });

  resultadoAdmin.innerHTML += "<hr><strong>🍽️ Detalles</strong><br><br>";

  const detalles = await getDocs(collection(db, "detalles"));
  detalles.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `
      <div style="margin-bottom:12px">
        🍽️ <strong>Comida:</strong> ${d.comida}<br>
        📍 <strong>Lugar:</strong> ${d.lugar}<br>
        💬 <strong>Comentario:</strong> ${d.comentario || "—"}
      </div>
    `;
  });
});

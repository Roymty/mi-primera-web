import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 PEGA AQUÍ TUS DATOS REALES */
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
const formulario = document.getElementById("formulario");

/* GUARDAR RESPUESTA */
async function guardarRespuesta(respuesta) {
  await addDoc(collection(db, "respuestas"), {
    respuesta,
    fecha: new Date()
  });

mensaje.textContent = "Gracias por responder.";
mensaje.style.opacity = 1;

// ocultar después de 2 segundos
setTimeout(() => {
  mensaje.classList.add("desaparecer");
}, 2000);

  btnSi.style.display = "none";
  btnNo.style.display = "none";
}

/* BOTONES */
btnSi.addEventListener("click", async () => {
  await guardarRespuesta("Sí");

  document.getElementById("invitacion")
    .classList.add("desaparecer");

  formulario.classList.remove("oculto");
});


btnNo.addEventListener("click", () => {
  guardarRespuesta("No");
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

  formulario.innerHTML = "<p>Gracias, lo tomaré en cuenta 😊</p>";
});

/* ADMIN */
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

  const datos = await getDocs(collection(db, "detalles"));
  resultadoAdmin.innerHTML = "";

  datos.forEach(doc => {
    const d = doc.data();
    resultadoAdmin.innerHTML += `
      <p><strong>${d.comida}</strong> – ${d.lugar}</p>
    `;
  });
});











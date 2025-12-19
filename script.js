import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 CONFIGURACIÓN FIREBASE (TUYA) */
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
const invitacion = document.getElementById("invitacion");
const formulario = document.getElementById("formulario");

/* ADMIN */
const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const verDatos = document.getElementById("verDatos");
const resultadoAdmin = document.getElementById("resultadoAdmin");

/* ESTADO */
let respuestaActual = null;

/* BOTÓN SÍ */
btnSi.addEventListener("click", () => {
  respuestaActual = "Sí";

  invitacion.classList.add("desaparecer");
  btnSi.style.display = "none";
  btnNo.style.display = "none";

  mensaje.textContent = "¡Excelente! ¿Me cuentas un poco más? 😊";
  mensaje.style.opacity = 1;

  setTimeout(() => {
    formulario.classList.remove("oculto");
  }, 300);
});

/* BOTÓN NO */
btnNo.addEventListener("click", async () => {
  await addDoc(collection(db, "respuestas"), {
    respuesta: "No",
    fecha: new Date()
  });

  invitacion.classList.add("desaparecer");
  btnSi.style.display = "none";
  btnNo.style.display = "none";

  mensaje.textContent = "Está bien, gracias por tu sinceridad 😊";
  mensaje.style.opacity = 1;
});

/* FORMULARIO (GUARDA TODO JUNTO) */
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "respuestas"), {
    respuesta: respuestaActual,
    comida: document.getElementById("comida").value,
    lugar: document.getElementById("lugar").value,
    comentario: document.getElementById("comentario").value,
    fecha: new Date()
  });

  formulario.innerHTML = "<p>Gracias, lo tomaré en cuenta 😊</p>";
  mensaje.style.display = "none";
});

/* ADMIN TOGGLE */
adminToggle.addEventListener("click", () => {
  adminPanel.style.display =
    adminPanel.style.display === "block" ? "none" : "block";
});

/* ADMIN VER RESPUESTAS */
verDatos.addEventListener("click", async () => {
  if (document.getElementById("adminPass").value !== "1234") {
    resultadoAdmin.textContent = "Acceso denegado";
    return;
  }

  resultadoAdmin.innerHTML = "<h4>Respuestas</h4>";

  const q = query(
    collection(db, "respuestas"),
    orderBy("fecha", "desc")
  );

  const datos = await getDocs(q);

  datos.forEach(doc => {
    const d = doc.data();
    const fecha = d.fecha?.toDate
      ? d.fecha.toDate().toLocaleString()
      : "—";

    resultadoAdmin.innerHTML += `
      <hr>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Respuesta:</strong> ${d.respuesta}</p>
      ${
        d.respuesta === "Sí"
          ? `
            <p>🍽 ${d.comida}</p>
            <p>📍 ${d.lugar}</p>
            <p>💬 ${d.comentario || "-"}</p>
          `
          : ""
      }
    `;
  });
});









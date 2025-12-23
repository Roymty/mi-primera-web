import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
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
const mensajeNo = document.getElementById("mensajeNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const acciones = document.getElementById("acciones");
const confirmarContraseñaInput = document.getElementById("confirmarContraseña");

/* ================= GUARDAR RESPUESTA ================= */

async function guardarRespuesta(respuesta) {
  await addDoc(collection(db, "respuestas"), {
    respuesta,
    fecha: serverTimestamp()
  });

  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;
  acciones.style.display = "none";
}

/* ================= BOTÓN SÍ ================= */

btnSi.addEventListener("click", async () => {
  await guardarRespuesta("Sí");

  // Ocultar mensaje de "Gracias por responder"
  mensaje.style.opacity = 0;
  
  // Ocultar invitación
  invitacion.style.display = "none";

  // Mostrar formulario después de un pequeño retraso
  setTimeout(() => {
    formulario.classList.remove("oculto");
    mensajeFinal.classList.remove("oculto");
  }, 300);  // 300ms de retraso para dar tiempo a que se oculte el mensaje
});

/* ================= BOTÓN NO ================= */

btnNo.addEventListener("click", async () => {
  await guardarRespuesta("No");
  invitacion.style.display = "none";
  mensajeNo.classList.remove("oculto");
});

/* ================= FORMULARIO ================= */

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "detalles"), {
    comida: comida.value,
    lugar: lugar.value,
    comentario: comentario.value,
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

/* ================= BORRAR DATOS CON CONTRASEÑA ================= */

const borrarDatosBtn = document.getElementById("borrarDatos");

borrarDatosBtn.addEventListener("click", async () => {
  const password = "admin123";  // Contraseña predeterminada para borrar datos

  if (confirmarContraseñaInput.value !== password) {
    alert("Contraseña incorrecta.");
    return;
  }

  if (confirm("¿Estás seguro de que deseas borrar todos los datos? Esta acción es irreversible.")) {
    // Borrar datos de la colección "respuestas"
    const respuestas = await getDocs(collection(db, "respuestas"));
    respuestas.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Borrar datos de la colección "detalles"
    const detalles = await getDocs(collection(db, "detalles"));
    detalles.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    alert("Todos los datos han sido borrados.");
    confirmarContraseñaInput.value = "";  // Limpiar el campo de contraseña
  } else {
    alert("Operación cancelada.");
  }
});

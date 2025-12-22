import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE ================= */

// Configuración de Firebase, con los detalles de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDouWz1WV4-k2b2g_S0j_o746_8dHZPtGE",
  authDomain: "invitacion-web-84d4f.firebaseapp.com",
  projectId: "invitacion-web-84d4f",
  storageBucket: "invitacion-web-84d4f.firebasestorage.app",
  messagingSenderId: "743465964686",
  appId: "1:743465964686:web:f9dca07e62862fe47ee5df"
};

const app = initializeApp(firebaseConfig); // Inicialización de la app en Firebase
const db = getFirestore(app); // Referencia a Firestore

/* ================= ELEMENTOS ================= */

// Acceso a elementos del DOM para interactuar con ellos
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const mensaje = document.getElementById("mensaje");
const mensajeFinal = document.getElementById("mensajeFinal");
const mensajeNo = document.getElementById("mensajeNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const card = document.querySelector(".card");
const adminPass = document.getElementById("adminPass");  // Contraseña de admin
const deletePass = document.getElementById("deletePass");  // Contraseña para borrar
const resultadoAdmin = document.getElementById("resultadoAdmin");
const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const verDatos = document.getElementById("verDatos");
const borrarDatos = document.getElementById("borrarDatos");

/* ================= CONTRASEÑAS ================= */

// Contraseña para ver respuestas (admin)
const ADMIN_PASSWORD = "1234"; // Cambia la contraseña de admin aquí

// Contraseña para borrar datos
const DELETE_PASSWORD = "delete2025"; // Cambia la contraseña para borrar aquí

/* ================= MENSAJE VISUAL ================= */

// Función para mostrar el mensaje de agradecimiento
function mostrarGracias() {
  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;

  btnSi.style.display = "none";
  btnNo.style.display = "none";

  setTimeout(() => {
    mensaje.style.opacity = 0;
  }, 1000);
}

// Función para manejar el botón "Sí"
btnSi.addEventListener("click", () => {
  mostrarGracias();

  card.classList.add("compacta");
  invitacion.style.display = "none";

  setTimeout(() => {
    formulario.classList.remove("oculto");
    mensajeFinal.style.opacity = 1;
  }, 300);
});

// Función para manejar el botón "No"
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

// Enviar detalles cuando el formulario se envía
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

/* ================= ADMIN ================= */

// Mostrar y ocultar el panel de admin
adminToggle.addEventListener("click", () => {
  adminPanel.style.display =
    adminPanel.style.display === "block" ? "none" : "block";
});

// Ver respuestas de usuarios
verDatos.addEventListener("click", async () => {
  if (adminPass.value !== ADMIN_PASSWORD) { // Validación con la contraseña de admin
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

// Borrar los datos de Firestore
borrarDatos.addEventListener("click", async () => {
  if (deletePass.value !== DELETE_PASSWORD) { // Validación con la contraseña de borrado
    resultadoAdmin.textContent = "Acceso denegado";
    return;
  }

  const confirmacion = confirm("¿Estás seguro de que deseas borrar todos los datos?");
  if (confirmacion) {
    try {
      const querySnapshot = await getDocs(collection(db, "detalles"));
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, "detalles", docSnapshot.id)); // Eliminar documentos
      });

      resultadoAdmin.innerHTML = "Todos los datos han sido borrados.";
    } catch (error) {
      console.error("Error al borrar los documentos: ", error);
      resultadoAdmin.innerHTML = "Hubo un error al borrar los datos.";
    }
  }
});



// Importamos las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= CONFIGURACIÓN FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDouWz1WV4-k2b2g_S0j_o746_8dHZPtGE",
  authDomain: "invitacion-web-84d4f.firebaseapp.com",
  projectId: "invitacion-web-84d4f",
  storageBucket: "invitacion-web-84d4f.firebasestorage.app",
  messagingSenderId: "743465964686",
  appId: "1:743465964686:web:f9dca07e62862fe47ee5df"
};

// Inicializamos la app y la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= ELEMENTOS DEL DOM ================= */
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const mensaje = document.getElementById("mensaje");
const mensajeFinal = document.getElementById("mensajeFinal");
const mensajeNo = document.getElementById("mensajeNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const card = document.querySelector(".card");

/* ================= LÓGICA DE BOTONES ================= */

// Función auxiliar para mostrar mensaje temporal de gracias
function mostrarGracias() {
  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;
  btnSi.style.display = "none";
  btnNo.style.display = "none";
  setTimeout(() => { mensaje.style.opacity = 0; }, 1000);
}

// Evento al hacer click en SÍ
btnSi.addEventListener("click", () => {
  mostrarGracias();
  card.classList.add("compacta"); // Achicamos la tarjeta
  invitacion.style.display = "none"; // Quitamos el texto inicial
  setTimeout(() => {
    formulario.classList.remove("oculto"); // Mostramos el formulario de comida
    mensajeFinal.style.opacity = 1;
  }, 300);
});

// Evento al hacer click en NO
btnNo.addEventListener("click", async () => {
  mostrarGracias();
  // Guardamos inmediatamente que dijo que NO
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

// Evento al enviar el formulario (cuando dijo SÍ)
formulario.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que la página se recargue
  
  // Guardamos todos los datos en Firebase
  await addDoc(collection(db, "detalles"), {
    respuesta: "Sí",
    comida: document.getElementById("comida").value,
    lugar: document.getElementById("lugar").value,
    comentario: document.getElementById("comentario").value,
    fecha: new Date()
  });
  
  // Ocultamos los inputs para mostrar mensaje de éxito final
  document.getElementById("comida").style.display = "none";
  document.getElementById("lugar").style.display = "none";
  document.getElementById("comentario").style.display = "none";
  formulario.querySelector("button").style.display = "none";
  
  mensajeFinal.textContent = "Gracias, lo tomaré en cuenta 😊";
});

/* ================= LÓGICA PANEL ADMIN ================= */

const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const verDatos = document.getElementById("verDatos");
const btnBorrar = document.getElementById("borrarDatos");
const resultadoAdmin = document.getElementById("resultadoAdmin");
const adminPass = document.getElementById("adminPass");

// Abrir/Cerrar panel con el punto secreto
adminToggle.addEventListener("click", () => {
  adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
});

// Leer datos de Firebase
verDatos.addEventListener("click", async () => {
  if (adminPass.value !== "1234") {
    resultadoAdmin.textContent = "Acceso denegado";
    return;
  }
  
  resultadoAdmin.innerHTML = "Cargando...";
  
  try {
    const datos = await getDocs(collection(db, "detalles"));
    resultadoAdmin.innerHTML = "<strong>Respuestas:</strong><br><hr>";
    
    if (datos.empty) {
        resultadoAdmin.innerHTML += "No hay respuestas aún.";
        return;
    }

    // Recorremos cada respuesta encontrada
    datos.forEach(doc => {
      const d = doc.data();
      // Formateamos la visualización (MEJORA: Incluye lugar y comentario)
      resultadoAdmin.innerHTML += `
        <strong>🗳️ Respuesta:</strong> ${d.respuesta}<br>
        ${d.comida ? `<strong>🍽️ Comida:</strong> ${d.comida}<br>` : ""}
        ${d.lugar ? `<strong>📍 Lugar:</strong> ${d.lugar}<br>` : ""}
        ${d.comentario ? `<strong>💬 Nota:</strong> ${d.comentario}<br>` : ""}
        
        <div style="margin-top: 6px; font-size: 13px; color: #222;">
          <strong>📅 Fecha: ${d.fecha?.toDate?.().toLocaleString() || "Sin fecha"}</strong>
        </div>
        <hr style="border: 0.5px solid #eee; margin: 10px 0;">
      `;
    });
  } catch (error) {
    resultadoAdmin.innerHTML = "Error al obtener datos";
    console.error(error);
  }
});

// Lógica para borrar toda la base de datos
btnBorrar.addEventListener("click", async () => {
  if (adminPass.value !== "1234") {
    alert("Contraseña incorrecta");
    return;
  }
  
  if (confirm("¿Estás seguro de borrar TODA la información recopilada?")) {
    const datos = await getDocs(collection(db, "detalles"));
    // Creamos una lista de promesas de borrado para ejecutarlas todas
    const promesas = datos.docs.map(d => deleteDoc(doc(db, "detalles", d.id)));
    await Promise.all(promesas);
    
    resultadoAdmin.innerHTML = "✅ Datos borrados";
    alert("Base de datos limpiada con éxito");
  }
});

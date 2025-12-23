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

/* ================= LÓGICA DE USUARIO ================= */

function mostrarGracias() {
  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;
  btnSi.style.display = "none";
  btnNo.style.display = "none";
  setTimeout(() => { mensaje.style.opacity = 0; }, 1000);
}

btnSi.addEventListener("click", () => {
  mostrarGracias();
  card.classList.add("compacta");
  invitacion.style.display = "none";
  setTimeout(() => {
    formulario.classList.remove("oculto");
    mensajeFinal.style.opacity = 1;
  }, 300);
});

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

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  await addDoc(collection(db, "detalles"), {
    respuesta: "Sí",
    comida: document.getElementById("comida").value,
    lugar: document.getElementById("lugar").value,
    comentario: document.getElementById("comentario").value,
    fecha: new Date()
  });
  
  document.getElementById("comida").style.display = "none";
  document.getElementById("lugar").style.display = "none";
  document.getElementById("comentario").style.display = "none";
  formulario.querySelector("button").style.display = "none";
  
  mensajeFinal.textContent = "Gracias, lo tomaré en cuenta 😊";
});

/* ================= LÓGICA DE ADMINISTRACIÓN ================= */

const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const verDatos = document.getElementById("verDatos");
const btnBorrar = document.getElementById("borrarDatos");
const resultadoAdmin = document.getElementById("resultadoAdmin");
const adminPass = document.getElementById("adminPass");

// Abrir y cerrar panel
adminToggle.addEventListener("click", () => {
  adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
});

// Ver datos (Usa contraseña 1234)
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
        resultadoAdmin.innerHTML += "No hay respuestas registradas.";
        return;
    }

    datos.forEach(doc => {
      const d = doc.data();
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
    resultadoAdmin.innerHTML = "Error al conectar con la base de datos.";
  }
});

// Borrado masivo (Usa contraseña maestra 1349164)
btnBorrar.addEventListener("click", async () => {
  // Primero debe haber puesto la clave de entrada al panel
  if (adminPass.value !== "1234") {
    alert("Primero ingresa la contraseña de acceso al panel.");
    return;
  }

  // Segunda capa: Pedir contraseña especial de borrado
  const passMaestra = prompt("⚠️ ACCIÓN PELIGROSA: Ingresa la CONTRASEÑA DE BORRADO para vaciar la base de datos:");

  if (passMaestra !== "1349164") {
    alert("Contraseña de borrado incorrecta. Acción cancelada.");
    return;
  }

  // Tercera capa: Confirmación final
  if (confirm("¿Confirmas que quieres eliminar TODAS las respuestas permanentemente?")) {
    try {
      resultadoAdmin.innerHTML = "Limpiando base de datos...";
      const datos = await getDocs(collection(db, "detalles"));
      const promesas = datos.docs.map(d => deleteDoc(doc(db, "detalles", d.id)));
      
      await Promise.all(promesas);
      
      resultadoAdmin.innerHTML = "✅ Base de datos vaciada.";
      alert("Se han eliminado todos los registros.");
      adminPass.value = ""; // Limpiar clave
    } catch (error) {
      alert("Error al intentar borrar la información.");
    }
  }
});

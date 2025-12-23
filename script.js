import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Referencias
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const invitacion = document.getElementById("invitacion");
const formulario = document.getElementById("formulario");
const mensajeNo = document.getElementById("mensajeNo");
const mensajeEstado = document.getElementById("mensajeEstado");
const mainCard = document.getElementById("mainCard");

// --- Lógica Usuario ---

const notificar = (texto) => {
  mensajeEstado.textContent = texto;
  mensajeEstado.style.opacity = 1;
  setTimeout(() => { mensajeEstado.style.opacity = 0; }, 2500);
};

btnSi.onclick = () => {
  invitacion.classList.add("oculto");
  mainCard.classList.add("compacta");
  formulario.classList.remove("oculto");
};

btnNo.onclick = async () => {
  btnNo.disabled = true;
  notificar("Guardando respuesta...");
  try {
    await addDoc(collection(db, "detalles"), { respuesta: "No", fecha: new Date() });
    invitacion.classList.add("oculto");
    mensajeNo.classList.remove("oculto");
  } catch (e) {
    notificar("Error de conexión ❌");
    btnNo.disabled = false;
  }
};

formulario.onsubmit = async (e) => {
  e.preventDefault();
  const btnEnviar = document.getElementById("btnEnviar");
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando...";

  const datos = {
    respuesta: "Sí",
    comida: document.getElementById("comida").value,
    lugar: document.getElementById("lugar").value,
    comentario: document.getElementById("comentario").value,
    fecha: new Date()
  };

  try {
    await addDoc(collection(db, "detalles"), datos);
    document.getElementById("camposForm").classList.add("oculto");
    document.getElementById("mensajeFinal").textContent = "¡Gracias! Lo tomaré muy en cuenta 😊";
  } catch (e) {
    notificar("Error al guardar ❌");
    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar";
  }
};

// --- Lógica Admin ---
const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const adminPass = document.getElementById("adminPass");
const resultadoAdmin = document.getElementById("resultadoAdmin");

adminToggle.onclick = () => {
  adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
};

document.getElementById("verDatos").onclick = async () => {
  if (adminPass.value !== "1234") return alert("Contraseña incorrecta");
  
  resultadoAdmin.innerHTML = "Cargando...";
  const querySnapshot = await getDocs(collection(db, "detalles"));
  resultadoAdmin.innerHTML = "";
  
  if (querySnapshot.empty) resultadoAdmin.innerHTML = "No hay respuestas.";

  querySnapshot.forEach((doc) => {
    const d = doc.data();
    const fecha = d.fecha?.toDate ? d.fecha.toDate().toLocaleString() : "Sin fecha";
    resultadoAdmin.innerHTML += `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <b>${d.respuesta}</b> - ${fecha}<br>
        <small>${d.comida || ''} en ${d.lugar || ''}</small>
      </div>`;
  });
};

document.getElementById("borrarDatos").onclick = async () => {
  if (adminPass.value !== "1234") return;
  const master = prompt("Contraseña Maestra:");
  if (master === "1349164" && confirm("¿Borrar todo?")) {
    const snapshot = await getDocs(collection(db, "detalles"));
    for (const d of snapshot.docs) { await deleteDoc(doc(db, "detalles", d.id)); }
    resultadoAdmin.innerHTML = "Base de datos limpia.";
  }
};

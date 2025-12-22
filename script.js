import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* FIREBASE */
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

/* RESPUESTA */
async function guardar(respuesta) {
  await addDoc(collection(db, "respuestas"), { respuesta, fecha: new Date() });
  mensaje.textContent = "Gracias por responder 😊";
  mensaje.style.opacity = 1;
  btnSi.style.display = btnNo.style.display = "none";
}

/* SI */
btnSi.onclick = async () => {
  await guardar("Sí");
  invitacion.style.display = "none";
  formulario.classList.remove("oculto");
};

/* NO */
btnNo.onclick = async () => {
  await guardar("No");
  invitacion.style.display = "none";
  mensajeNo.classList.remove("oculto");
};

/* FORM */
formulario.onsubmit = async e => {
  e.preventDefault();
  await addDoc(collection(db, "detalles"), {
    comida: comida.value,
    lugar: lugar.value,
    comentario: comentario.value,
    fecha: new Date()
  });
  formulario.innerHTML = "<p>Gracias, lo tomaré en cuenta 😊</p>";
};

/* ADMIN */
adminToggle.onclick = () =>
  adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";

verDatos.onclick = async () => {
  if (adminPass.value !== "1234") return;
  resultadoAdmin.innerHTML = "";
  (await getDocs(collection(db, "detalles"))).forEach(d => {
    const x = d.data();
    resultadoAdmin.innerHTML += `<p>${x.comida} - ${x.lugar}</p>`;
  });
};

/* CONFIG NOMBRES */
const txtInvitador = document.getElementById("txtInvitador");
const txtInvitada = document.getElementById("txtInvitada");

function cargarNombres() {
  txtInvitador.textContent = localStorage.getItem("invitador") || "";
  txtInvitada.textContent = localStorage.getItem("invitada") || "";
}

guardarNombres.onclick = () => {
  localStorage.setItem("invitador", nombreInvitador.value);
  localStorage.setItem("invitada", nombreInvitada.value);
  cargarNombres();
};

configToggle.onclick = () =>
  configPanel.style.display = configPanel.style.display === "block" ? "none" : "block";

cargarNombres();


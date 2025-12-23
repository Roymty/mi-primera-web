import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc
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

/* --- GESTIÓN DE NOMBRES EN LA NUBE --- */
const nInvitado = document.getElementById("nombreInvitado");
const nAnfitrion = document.getElementById("nombreAnfitrion");

async function cargarNombres() {
  const docSnap = await getDoc(doc(db, "configuracion", "nombres"));
  if (docSnap.exists()) {
    nInvitado.textContent = docSnap.data().invitado;
    nAnfitrion.textContent = docSnap.data().anfitrion;
  }
}
cargarNombres();

document.getElementById("guardarNombres").addEventListener("click", async () => {
  const inv = document.getElementById("inputInvitado").value;
  const anf = document.getElementById("inputAnfitrion").value;
  if (inv && anf) {
    await setDoc(doc(db, "configuracion", "nombres"), { invitado: inv, anfitrion: anf });
    alert("Nombres actualizados para todos");
    location.reload();
  }
});

/* --- INTERACCIÓN DE PANELES --- */
document.getElementById("configToggle").addEventListener("click", () => {
  const p = document.getElementById("configPanel");
  p.style.display = p.style.display === "block" ? "none" : "block";
});

document.getElementById("adminToggle").addEventListener("click", () => {
  const p = document.getElementById("adminPanel");
  p.style.display = p.style.display === "block" ? "none" : "block";
});

/* --- LÓGICA DE RESPUESTAS --- */
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const card = document.querySelector(".card");

btnSi.addEventListener("click", () => {
  card.classList.add("compacta");
  invitacion.style.display = "none";
  btnSi.style.display = "none"; btnNo.style.display = "none";
  formulario.classList.remove("oculto");
});

btnNo.addEventListener("click", async () => {
  await addDoc(collection(db, "detalles"), { respuesta: "No", fecha: new Date() });
  card.classList.add("compacta");
  invitacion.style.display = "none";
  btnSi.style.display = "none"; btnNo.style.display = "none";
  document.getElementById("mensajeNo").classList.remove("oculto");
  document.getElementById("mensajeNo").style.opacity = 1;
});

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const comida = document.getElementById("comida").value;
  const lugar = document.getElementById("lugar").value;

  // Validación: No permite que sea solo números
  if (/^\d+$/.test(comida) || /^\d+$/.test(lugar)) {
    alert("El nombre debe contener letras."); return;
  }

  await addDoc(collection(db, "detalles"), {
    respuesta: "Sí", comida, lugar,
    comentario: document.getElementById("comentario").value,
    fecha: new Date()
  });
  formulario.innerHTML = "<p class='mensaje fade-in' style='opacity:1'>¡Gracias! Lo tomaré en cuenta 😊</p>";
});

/* --- PANEL ADMIN (RESPUESTAS) --- */
document.getElementById("verDatos").addEventListener("click", async () => {
  if (document.getElementById("adminPass").value !== "1234") { alert("Error"); return; }
  const res = document.getElementById("resultadoAdmin");
  res.innerHTML = "Cargando...";
  const datos = await getDocs(collection(db, "detalles"));
  res.innerHTML = "<strong>Respuestas:</strong><hr>";
  datos.forEach(d => {
    const data = d.data();
    res.innerHTML += `<div>
      <b>${data.respuesta}</b> | ${data.comida || ''}<br>
      📍 ${data.lugar || ''}<br>
      <small>📅 ${data.fecha?.toDate().toLocaleString() || ''}</small><hr>
    </div>`;
  });
});

document.getElementById("borrarDatos").addEventListener("click", async () => {
  if (document.getElementById("adminPass").value !== "1234") return;
  const pass = prompt("🔐 CONTRASEÑA MAESTRA DE BORRADO:");
  if (pass === "1349164") {
    if (confirm("¿Borrar todo permanentemente?")) {
      const datos = await getDocs(collection(db, "detalles"));
      for (const d of datos.docs) { await deleteDoc(doc(db, "detalles", d.id)); }
      alert("Base de datos limpia");
      location.reload();
    }
  } else { alert("Clave incorrecta"); }
});

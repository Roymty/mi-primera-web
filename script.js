import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc
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

/* ================= NOMBRES DESDE FIREBASE ================= */

const nombreInvitadoSpan = document.getElementById("nombreInvitado");
const nombreAnfitrionSpan = document.getElementById("nombreAnfitrion");

// Función para leer los nombres de la base de datos
async function cargarNombresCloud() {
  const docRef = doc(db, "configuracion", "nombres");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    nombreInvitadoSpan.textContent = data.invitado;
    nombreAnfitrionSpan.textContent = data.anfitrion;
  } else {
    nombreInvitadoSpan.textContent = "[Nombre]";
    nombreAnfitrionSpan.textContent = "[Tu Nombre]";
  }
}
cargarNombresCloud();

// Función para guardar los nombres en la nube
document.getElementById("guardarNombres").addEventListener("click", async () => {
  const inv = document.getElementById("inputInvitado").value;
  const anf = document.getElementById("inputAnfitrion").value;

  if (!inv || !anf) {
    alert("Por favor completa ambos nombres");
    return;
  }

  try {
    await setDoc(doc(db, "configuracion", "nombres"), {
      invitado: inv,
      anfitrion: anf
    });
    alert("Nombres guardados en la nube. Ahora todos los verán.");
    location.reload(); // Recargar para ver cambios
  } catch (e) {
    alert("Error al guardar");
  }
});

/* ================= LÓGICA DE PANELES ================= */

document.getElementById("configToggle").addEventListener("click", () => {
  const p = document.getElementById("configPanel");
  p.style.display = p.style.display === "block" ? "none" : "block";
});

document.getElementById("adminToggle").addEventListener("click", () => {
  const p = document.getElementById("adminPanel");
  p.style.display = p.style.display === "block" ? "none" : "block";
});

/* ================= LÓGICA RESPUESTAS (SÍ/NO) ================= */

const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
const card = document.querySelector(".card");

btnSi.addEventListener("click", () => {
  card.classList.add("compacta");
  invitacion.style.display = "none";
  document.getElementById("btnSi").style.display = "none";
  document.getElementById("btnNo").style.display = "none";
  setTimeout(() => {
    formulario.classList.remove("oculto");
  }, 300);
});

btnNo.addEventListener("click", async () => {
  await addDoc(collection(db, "detalles"), { respuesta: "No", fecha: new Date() });
  card.classList.add("compacta");
  invitacion.style.display = "none";
  document.getElementById("btnSi").style.display = "none";
  document.getElementById("btnNo").style.display = "none";
  document.getElementById("mensajeNo").classList.remove("oculto");
  document.getElementById("mensajeNo").style.opacity = 1;
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
  formulario.innerHTML = "<p class='mensaje fade-in' style='opacity:1'>Gracias, lo tomaré en cuenta 😊</p>";
});

/* ================= PANEL ADMIN RESPUESTAS ================= */

document.getElementById("verDatos").addEventListener("click", async () => {
  if (document.getElementById("adminPass").value !== "1234") {
    alert("Error"); return;
  }
  const res = document.getElementById("resultadoAdmin");
  res.innerHTML = "Cargando...";
  const datos = await getDocs(collection(db, "detalles"));
  res.innerHTML = "";
  datos.forEach(d => {
    const data = d.data();
    res.innerHTML += `<div style="border-bottom:1px solid #eee; padding:5px">
      <b>${data.respuesta}</b> | ${data.comida || ''}<br>
      <small>${data.fecha?.toDate().toLocaleString() || ''}</small>
    </div>`;
  });
});

document.getElementById("borrarDatos").addEventListener("click", async () => {
  if (document.getElementById("adminPass").value !== "1234") return;
  const pass = prompt("Clave Maestra:");
  if (pass === "1349164") {
    const datos = await getDocs(collection(db, "detalles"));
    datos.forEach(async (d) => await deleteDoc(doc(db, "detalles", d.id)));
    alert("Borrado");
  }
});

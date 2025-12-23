import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- LÓGICA DE NOMBRES DINÁMICOS ---
const docNombres = doc(db, "configuracion", "nombres_actuales");

// Mostrar/Ocultar panel de nombres (Punto central)
document.getElementById('toggleNombres').onclick = () => {
    document.getElementById('panelNombres').classList.toggle('oculto');
};

// Leer nombres en tiempo real
onSnapshot(docNombres, (snap) => {
    if (snap.exists()) {
        const data = snap.data();
        document.getElementById('nombreInvitado').innerText = data.invitado || "amig@";
        document.getElementById('nombreAnfitrion').innerText = data.anfitrion || "Tu amig@";
        document.getElementById('inputInvitado').value = data.invitado || "";
        document.getElementById('inputAnfitrion').value = data.anfitrion || "";
    }
});

// Guardar nombres
document.getElementById('btnGuardar').onclick = async () => {
    const inv = document.getElementById('inputInvitado').value;
    const de = document.getElementById('inputAnfitrion').value;
    await setDoc(docNombres, { invitado: inv, anfitrion: de });
    alert("Invitación personalizada ✅");
};

// Borrar nombres (Solo datos de texto)
document.getElementById('btnBorrarNombres').onclick = async () => {
    await setDoc(docNombres, { invitado: "", anfitrion: "" });
    alert("Datos borrados 🗑️");
};

// --- FLUJO DE USUARIO (TU CÓDIGO ORIGINAL) ---
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const invitacion = document.getElementById("invitacion");
const formulario = document.getElementById("formulario");
const mainCard = document.getElementById("mainCard");
const mensajeEstado = document.getElementById("mensajeEstado");

const notificar = (texto) => {
  mensajeEstado.textContent = texto;
  mensajeEstado.style.opacity = 1;
  setTimeout(() => mensajeEstado.style.opacity = 0, 2500);
};

btnSi.onclick = () => {
  invitacion.classList.add("oculto");
  mainCard.classList.add("compacta");
  formulario.classList.remove("oculto");
};

btnNo.onclick = async () => {
  btnNo.disabled = true;
  notificar("Guardando...");
  try {
    await addDoc(collection(db, "detalles"), { respuesta: "No", fecha: new Date() });
    invitacion.classList.add("oculto");
    document.getElementById("mensajeNo").classList.remove("oculto");
  } catch (e) {
    notificar("Error de red ❌");
    btnNo.disabled = false;
  }
};

formulario.onsubmit = async (e) => {
  e.preventDefault();
  const btn = document.getElementById("btnEnviar");
  btn.disabled = true;
  btn.textContent = "Enviando...";

  const datos = {
    respuesta: "Sí",
    comida: document.getElementById("comida").value,
    lugar: document.getElementById("lugar").value,
    comentario: document.getElementById("comentario").value || "Sin comentarios",
    fecha: new Date()
  };

  try {
    await addDoc(collection(db, "detalles"), datos);
    document.getElementById("camposForm").classList.add("oculto");
    document.getElementById("mensajeFinal").textContent = "¡Gracias! Todo se guardó perfectamente 😊";
  } catch (e) {
    notificar("Error al enviar ❌");
    btn.disabled = false;
    btn.textContent = "Enviar";
  }
};

// --- FLUJO DE ADMIN ORIGINAL ---
document.getElementById("adminToggle").onclick = () => {
  const panel = document.getElementById("adminPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
};

document.getElementById("verDatos").onclick = async () => {
  if (document.getElementById("adminPass").value !== "1234") return alert("Acceso Incorrecto");
  const res = document.getElementById("resultadoAdmin");
  res.innerHTML = "Cargando...";
  try {
    const q = query(collection(db, "detalles"), orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    res.innerHTML = "";
    if (snap.empty) { res.innerHTML = "<p>No hay datos.</p>"; return; }
    let n = snap.size;
    snap.forEach((doc) => {
      const d = doc.data();
      const fechaFormateada = d.fecha?.toDate ? d.fecha.toDate().toLocaleString() : "---";
      res.innerHTML += `
        <div style="border: 1px solid #eee; border-radius: 10px; padding: 12px; margin-bottom: 12px; text-align: left; background: #fafafa; color: #333;">
          <b style="color: #c89b7b;">Respuesta #${n--}</b><hr style="border:0.2px solid #eee">
          <div style="font-size: 13px; line-height: 1.6;">
            <b>1. Aceptó:</b> ${d.respuesta}<br>
            ${d.comida ? `<b>2. Comida:</b> ${d.comida}<br>` : ""}
            ${d.lugar ? `<b>3. Lugar:</b> ${d.lugar}<br>` : ""}
            <b>4. Nota:</b> ${d.comentario}<br>
            <div style="margin-top:8px; font-size:11px; color:#aaa;">📅 ${fechaFormateada}</div>
          </div>
        </div>`;
    });
  } catch (e) { res.innerHTML = "Error al leer Firebase."; }
};

document.getElementById("borrarDatos").onclick = async () => {
  if (confirm("¿Estás seguro de ELIMINAR TODAS las respuestas?")) {
    const p = prompt("Contraseña Maestra:");
    if (p === "1349164") {
      const snap = await getDocs(collection(db, "detalles"));
      for (const d of snap.docs) await deleteDoc(doc(db, "detalles", d.id));
      alert("Base de datos borrada");
      document.getElementById("resultadoAdmin").innerHTML = "";
    }
  }
};

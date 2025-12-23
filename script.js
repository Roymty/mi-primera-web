import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

/* --- ABRIR SOBRE --- */
const envelope = document.getElementById('envelope');
envelope.onclick = () => {
    envelope.classList.remove('close');
    envelope.classList.add('open');
};

/* --- PANEL N: NOMBRES --- */
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

document.getElementById("btnGuardar").onclick = async () => {
    const inv = document.getElementById("inputInvitado").value;
    const anf = document.getElementById("inputAnfitrion").value;
    if (inv && anf) {
        await setDoc(doc(db, "configuracion", "nombres"), { invitado: inv, anfitrion: anf });
        location.reload(); // Instantáneo sin toasts
    }
};

document.getElementById("btnBorrarNombres").onclick = async () => {
    await deleteDoc(doc(db, "configuracion", "nombres"));
    location.reload(); // Instantáneo sin toasts
};

/* --- FLUJO DE INVITACIÓN --- */
document.getElementById("btnSi").onclick = (e) => {
    e.stopPropagation(); // Evita conflicto con el sobre
    document.getElementById("invitacion").classList.add("oculto");
    document.getElementById("formulario").classList.remove("oculto");
};

document.getElementById("btnNo").onclick = async (e) => {
    e.stopPropagation();
    await addDoc(collection(db, "detalles"), { respuesta: "No", fecha: new Date() });
    document.getElementById("invitacion").classList.add("oculto");
    document.getElementById("mensajeNo").classList.remove("oculto");
};

document.getElementById("formulario").onsubmit = async (e) => {
    e.preventDefault();
    const datos = {
        respuesta: "Sí",
        comida: document.getElementById("comida").value,
        lugar: document.getElementById("lugar").value,
        comentario: document.getElementById("comentario").value || "Sin observaciones",
        fecha: new Date()
    };
    await addDoc(collection(db, "detalles"), datos);
    document.getElementById("camposForm").classList.add("oculto");
    document.getElementById("mensajeFinal").innerHTML = "<b>¡Enviado!</b><br>Todo se guardó correctamente 😊";
};

/* --- PANEL A: REPORTES --- */
document.getElementById("toggleNombres").onclick = () => document.getElementById("panelNombres").classList.toggle("oculto");
document.getElementById("adminToggle").onclick = () => document.getElementById("adminPanel").classList.toggle("oculto");

document.getElementById("verDatos").onclick = async () => {
    if (document.getElementById("adminPass").value !== "1234") return;
    const res = document.getElementById("resultadoAdmin");
    res.innerHTML = "<small>Cargando...</small>";
    
    const snap = await getDocs(query(collection(db, "detalles"), orderBy("fecha", "desc")));
    res.innerHTML = "";
    
    snap.forEach((doc) => {
        const d = doc.data();
        const fecha = d.fecha?.toDate().toLocaleString() || "";
        res.innerHTML += `
            <div style="text-align:left; font-size:11px; background:#fefefe; padding:10px; border-radius:8px; margin-bottom:10px; border-left:4px solid #c89b7b; box-shadow: 0 2px 5px rgba(0,0,0,0.05)">
                <b>✅ Aceptó:</b> ${d.respuesta}<br>
                <b>🍔 Comida:</b> ${d.comida || "-"}<br>
                <b>📍 Ir a:</b> ${d.lugar || "-"}<br>
                <b>📝 Obs:</b> ${d.comentario}<br>
                <small style="color:#bbb;">${fecha}</small>
            </div>`;
    });
};

document.getElementById("borrarDatos").onclick = async () => {
    if (confirm("¿Limpiar historial?") && prompt("Pass:") === "1349164") {
        const snap = await getDocs(collection(db, "detalles"));
        for (const d of snap.docs) await deleteDoc(doc(db, "detalles", d.id));
        location.reload();
    }
};

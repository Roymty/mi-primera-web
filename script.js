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

// ABRIR SOBRE
const envelope = document.getElementById('envelope');
const abrir = () => { envelope.classList.add('open'); };
envelope.addEventListener('click', abrir);
envelope.addEventListener('touchstart', abrir, {passive: true});

// NOMBRES
const nInvitado = document.getElementById("nombreInvitado");
const nAnfitrion = document.getElementById("nombreAnfitrion");

async function cargar() {
    const snap = await getDoc(doc(db, "configuracion", "nombres"));
    if (snap.exists()) {
        nInvitado.textContent = snap.data().invitado;
        nAnfitrion.textContent = snap.data().anfitrion;
    }
}
cargar();

document.getElementById("btnGuardar").onclick = async () => {
    const inv = document.getElementById("inputInvitado").value;
    const anf = document.getElementById("inputAnfitrion").value;
    if (inv && anf) {
        await setDoc(doc(db, "configuracion", "nombres"), { invitado: inv, anfitrion: anf });
        location.reload();
    }
};

document.getElementById("btnBorrarNombres").onclick = async () => {
    await deleteDoc(doc(db, "configuracion", "nombres"));
    location.reload();
};

// BOTONES CARTA
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");

btnSi.onclick = (e) => {
    e.stopPropagation();
    document.getElementById("invitacion").classList.add("oculto");
    document.getElementById("formulario").classList.remove("oculto");
};

btnNo.onclick = async (e) => {
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
    document.getElementById("mensajeFinal").innerHTML = "<b>¡Enviado con éxito!</b>";
};

// ADMIN PANELES
document.getElementById("toggleNombres").onclick = (e) => { e.stopPropagation(); document.getElementById("panelNombres").classList.toggle("oculto"); };
document.getElementById("adminToggle").onclick = () => document.getElementById("adminPanel").classList.toggle("oculto");

document.getElementById("verDatos").onclick = async () => {
    if (document.getElementById("adminPass").value !== "1234") return;
    const res = document.getElementById("resultadoAdmin");
    res.innerHTML = "Cargando...";
    const snap = await getDocs(query(collection(db, "detalles"), orderBy("fecha", "desc")));
    res.innerHTML = "";
    snap.forEach((doc) => {
        const d = doc.data();
        res.innerHTML += `<div style="text-align:left; font-size:10px; border-bottom:1px solid #eee; padding:5px;">
            <b>${d.respuesta}</b> | ${d.comida || ''} | ${d.lugar || ''}<br>${d.fecha?.toDate().toLocaleString() || ''}</div>`;
    });
};

document.getElementById("borrarDatos").onclick = async () => {
    if (confirm("¿Borrar?") && prompt("Clave:") === "1349164") {
        const snap = await getDocs(collection(db, "detalles"));
        for (const d of snap.docs) await deleteDoc(doc(db, "detalles", d.id));
        location.reload();
    }
};

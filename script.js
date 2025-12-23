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

/* --- GESTIÓN DE NOMBRES DINÁMICOS (Punto N) --- */
const nInvitado = document.getElementById("nombreInvitado");
const nAnfitrion = document.getElementById("nombreAnfitrion");

// Leer nombres de la nube al cargar
async function cargarNombresCloud() {
    const docSnap = await getDoc(doc(db, "configuracion", "nombres"));
    if (docSnap.exists()) {
        nInvitado.textContent = docSnap.data().invitado;
        nAnfitrion.textContent = docSnap.data().anfitrion;
    }
}
cargarNombresCloud();

// Guardar nombres en la nube
document.getElementById("btnGuardar").onclick = async () => {
    const inv = document.getElementById("inputInvitado").value;
    const anf = document.getElementById("inputAnfitrion").value;
    if (inv && anf) {
        await setDoc(doc(db, "configuracion", "nombres"), { invitado: inv, anfitrion: anf });
        alert("Nombres actualizados para todos");
        location.reload();
    } else {
        alert("Completa ambos nombres");
    }
};

document.getElementById("btnBorrarNombres").onclick = () => {
    document.getElementById("inputInvitado").value = "";
    document.getElementById("inputAnfitrion").value = "";
};

/* --- INTERFAZ USUARIO --- */
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const mainCard = document.getElementById("mainCard");
const formulario = document.getElementById("formulario");
const invitacion = document.getElementById("invitacion");
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
    notificar("Guardando...");
    await addDoc(collection(db, "detalles"), { respuesta: "No", fecha: new Date() });
    invitacion.classList.add("oculto");
    document.getElementById("mensajeNo").classList.remove("oculto");
};

formulario.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btnEnviar");
    btn.disabled = true;
    
    const datos = {
        respuesta: "Sí",
        comida: document.getElementById("comida").value,
        lugar: document.getElementById("lugar").value,
        comentario: document.getElementById("comentario").value || "Sin comentarios",
        fecha: new Date()
    };

    await addDoc(collection(db, "detalles"), datos);
    document.getElementById("camposForm").classList.add("oculto");
    document.getElementById("mensajeFinal").textContent = "¡Gracias! Lo tomaré en cuenta 😊";
};

/* --- GESTIÓN DE ADMIN (Punto A) --- */
document.getElementById("toggleNombres").onclick = () => {
    document.getElementById("panelNombres").classList.toggle("oculto");
};

document.getElementById("adminToggle").onclick = () => {
    document.getElementById("adminPanel").classList.toggle("oculto");
};

document.getElementById("verDatos").onclick = async () => {
    if (document.getElementById("adminPass").value !== "1234") return alert("Acceso Incorrecto");
    const res = document.getElementById("resultadoAdmin");
    res.innerHTML = "Cargando...";
    
    const q = query(collection(db, "detalles"), orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    res.innerHTML = "";
    
    snap.forEach((doc) => {
        const d = doc.data();
        res.innerHTML += `
            <div style="border-bottom: 1px solid #eee; padding: 10px; font-size: 12px; text-align: left;">
                <b>${d.respuesta}</b> | 🍽️ ${d.comida || '-'}<br>
                📍 ${d.lugar || '-'}<br>
                <small>${d.fecha?.toDate().toLocaleString() || ''}</small>
            </div>`;
    });
};

document.getElementById("borrarDatos").onclick = async () => {
    if (confirm("¿Borrar todas las respuestas?") && prompt("Contraseña Maestra:") === "1349164") {
        const snap = await getDocs(collection(db, "detalles"));
        for (const d of snap.docs) await deleteDoc(doc(db, "detalles", d.id));
        alert("Borrado");
        location.reload();
    }
};



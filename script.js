import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Guardar respuesta
window.guardarRespuesta = async function(respuesta) {

  if (localStorage.getItem("respondido")) {
    document.getElementById("mensaje").innerText =
      "Ya respondiste antes 💙";
    return;
  }

  await addDoc(collection(db, "respuestas"), {
    respuesta: respuesta,
    fecha: new Date()
  });

  localStorage.setItem("respondido", respuesta);

  document.getElementById("mensaje").innerText =
    respuesta === "Sí"
      ? "💙 Gracias por aceptar 😊"
      : "✨ Gracias por responder";
};

// Área privada
window.verResultados = async function () {

  const contraseñaCorrecta = "1349164"; // 🔐 CAMBIA ESTO
  const ingresada = document.getElementById("password").value;

  if (ingresada !== contraseñaCorrecta) {
    alert("Contraseña incorrecta");
    return;
  }

  document.getElementById("admin").style.display = "block";

  const lista = document.getElementById("listaRespuestas");
  lista.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "respuestas"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent =
      `${data.respuesta} — ${data.fecha.toDate().toLocaleString()}`;
    lista.appendChild(li);
  });
};








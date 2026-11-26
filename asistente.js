// Asistente OnicoCare (FAQ local)
const FAQ = [
  {
    q: "¿Qué es la onicofagia?",
    k: ["onicofagia", "que es", "hábito"],
    a: "La onicofagia es el hábito de morderse las uñas. Suele ser automático y aparece con estrés, ansiedad o aburrimiento. No es falta de voluntad."
  },
  {
    q: "¿Cómo puedo controlar el impulso?",
    k: ["impulso", "ganas", "controlar", "parar"],
    a: "Nombra el impulso, respira profundamente y usa tu objeto sensorial. El temporizador de 10 minutos puede ayudarte a esperar hasta que disminuya.",
    go: "impulsos"
  },
  {
    q: "Tengo dolor o una herida",
    k: ["herida", "dolor", "pus", "hinchazón", "sangre", "infect"],
    a: "Si tienes dolor, enrojecimiento, hinchazón, pus o sangrado, consulta a un profesional de la salud. Mantén la zona limpia y seca."
  },
  {
    q: "¿Cómo registro mis avances?",
    k: ["registro", "progreso", "guardar"],
    a: "En Registro puedes indicar cuántas veces te mordiste las uñas, cómo te sentiste y qué herramienta utilizaste.",
    go: "registro"
  },
  {
    q: "¿Qué es OnicoCare?",
    k: ["onicocare", "proyecto", "kit"],
    a: "OnicoCare acompaña con registro, cuidado cosmético seguro y derivación profesional. No diagnostica ni reemplaza una evaluación médica."
  }
];

const chat = $("#chat");
const pregunta = $("#q");

function escribirMensaje(texto, clase) {
  const mensaje = document.createElement("div");
  mensaje.className = "msg " + clase;
  mensaje.textContent = texto;
  chat.append(mensaje);
  chat.scrollTop = chat.scrollHeight;
  return mensaje;
}

function buscarRespuesta(texto) {
  const t = texto.toLower
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (/suicid|matarme|hacerme dano|quitarme la vida/.test(t)) {
    return {
      a: "Si tienes riesgo inmediato de dañarte, llama al 131 o busca urgencias. En Chile puedes contactar a Salud Responde al 600 360 7777.",
      emergencia: true
    };
  }

  let mejor = null;
  let puntos = 0;

  FAQ.forEach(item => {
    let coincidencias = 0;
    item.k.forEach(palabra => {
      if (t.includes(palabra)) coincidencias++;
    });
    if (coincidencias > puntos) {
      puntos = coincidencias;
      mejor = item;
    }
  });

  return mejor
    ? { a: mejor.a, go: mejor.go }
    : { a: "No tengo una respuesta segura para eso. Puedes usar las preguntas sugeridas o consultar a un profesional de la salud." };
}

function enviarPregunta() {
  const texto = pregunta.value.trim();
  if (!texto) return;

  escribirMensaje(texto, "u");
  pregunta.value = "";

  const respuesta = buscarRespuesta(texto);
  const mensaje = escribirMensaje(respuesta.a, "b");

  if (respuesta.go) {
    const boton = document.createElement("button");
    boton.className = "btn alt";
    boton.textContent = "Ir a la sección";
    boton.style.marginTop = "8px";
    boton.onclick = () => go(respuesta.go);
    mensaje.append(document.createElement("br"), boton);
  }
}

$("#enviar").onclick = enviarPregunta;
pregunta.onkeydown = e => {
  if (e.key === "Enter") enviarPregunta();
};

FAQ.forEach(item => {
  const boton = document.createElement("button");
  boton.textContent = item.q;
  boton.onclick = () => {
    pregunta.value = item.q;
    enviarPregunta();
  };
  $("#chips").append(boton);
});

escribirMensaje(
  "Hola, soy el asistente de OnicoCare. Puedo responder dudas frecuentes sobre onicofagia y el proyecto.",
  "b"
);

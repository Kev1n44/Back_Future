let timer;
let timeLeft = 15 * 60; // 15 minutes in seconds
let deloreanPosition = 0;
let inputHistory = [];
const keywords = [
  "Google Calendar", "google calendar", "googlecalendar", "calendar",
  "Figma", "figma", "Trello", "trello", "Notas", "notas", "Recordatorios", 
  "recordatorios", "cronograma", "Cronograma", "Google Sheets", "google sheets",
  "googlesheets", "Googlesheets", "Alarmas", "alarmas", "Hacer preguntas",
  "hacer preguntas", "Preguntar", "preguntar", "Notion", "notion", "Matriz",
  "matriz", "Organización", "organización", "Agenda", "agenda", "Organizador",
  "organizador", "Google Keep", "Google keep", "google keep", "OneTab", 
  "RescueTime", "Pomodoro", "pomodoro", "Apoyo", "apoyo", "Ayuda", "ayuda",
  "Delego", "delego", "Delegar", "delegar", "Planner", "planner", "Asana",
  "asana", "Priorizar", "priorizar", "Proyectos", "proyectos", "Controlar",
  "controlar", "Enfocar", "enfocar", "Foco", "foco", "Enfoque", "enfoque",
  "Lista", "lista", "Lista de tareas", "lista de tareas", "Lista de quehaceres",
  "lista de quehaceres", "Scoro", "scoro", "ProofHub", "ActiveCollab", 
  "Bitrix24", "Toggl", "Teamwork"
];

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const delorean = document.getElementById("delorean");
const speedInput = document.getElementById("speedInput");
const speedBtn = document.getElementById("speedBtn");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const downloadBtn = document.getElementById("downloadBtn");
const closePopup = document.getElementById("closePopup");

startBtn.addEventListener("click", startTimer);
speedBtn.addEventListener("click", checkKeyword);
downloadBtn.addEventListener("click", downloadResults);
closePopup.addEventListener("click", resetGame);

function startTimer() {
  clearInterval(timer);
  timeLeft = 15 * 60;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    clearInterval(timer);
    showPopup("🥺🥺🥺 Lo sentimos 🥺🥺🥺, tu DeLorean no alcanzó las 88 millas para regresar a su futuro. Sigue intentando, siempre puedes ser cada vez mejor en el manejo del tiempo, ⏰ ¡no te rindas! ⏰");
  }
}

function checkKeyword() {
  const input = speedInput.value.trim().toLowerCase(); // Convertir el texto ingresado a minúsculas para comparación sin distinción de mayúsculas/minúsculas.

  // Comprobar si alguna palabra clave está en el texto ingresado
  const foundKeyword = keywords.some(keyword => input.includes(keyword.toLowerCase())); 

  if (foundKeyword) {
    deloreanPosition += 20;

    // Obtener la posición de la línea y calcular el límite
    const road = document.querySelector(".road");
    const roadEndPosition = road.offsetLeft + road.offsetWidth; // Final de la carretera

    // Si el DeLorean ha llegado al final de la carretera, detenerlo y mostrar el mensaje
    if (deloreanPosition >= roadEndPosition - delorean.width) {
      deloreanPosition = roadEndPosition - delorean.width; // Ajustar al límite
      clearInterval(timer);
      showPopup("🔥🔥🔥🔥 ¡Felicitaciones! 🔥🔥🔥🔥, has alcanzado las 88 millas que requería el DeLorean para regresar al futuro ✅. ⏰ Eres un(a) maestro(a) en el manejo del tiempo ⏰");
    }

    delorean.style.left = `${deloreanPosition}px`;
    inputHistory.push(input);
  }

  speedInput.value = "";
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

function resetGame() {
  popup.style.display = "none";
  timerDisplay.textContent = "15:00";
  delorean.style.left = "0";
  deloreanPosition = 0;
  inputHistory = [];
}

function downloadResults() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Establecer el tamaño de la fuente
  context.font = "20px Arial";
  
  // Calcular el tamaño del mensaje y los inputs
  const messageWidth = context.measureText(popupMessage.textContent).width;
  const historyWidth = Math.max(...inputHistory.map(input => context.measureText(input).width));
  
  // Definir un margen y el alto de cada línea de texto
  const margin = 50;
  const lineHeight = 30;
  
  // Calcular el alto total necesario
  const messageHeight = lineHeight * (inputHistory.length + 2); // 2 líneas adicionales para el mensaje y título
  const canvasHeight = messageHeight + margin * 2; // Margen alrededor del contenido
  const canvasWidth = Math.max(messageWidth, historyWidth) + margin * 2; // Asegurarnos de que el canvas sea lo suficientemente ancho

  // Establecer el tamaño del lienzo
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Fondo blanco y texto negro
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";

  // Escribir el mensaje de felicitación y el historial
  context.fillText(popupMessage.textContent, margin, margin + lineHeight);
  context.fillText("Tus respuestas fueron:", margin, margin + lineHeight * 2);
  
  inputHistory.forEach((input, index) => {
    context.fillText(input, margin, margin + lineHeight * (index + 3)); // Ajustamos el índice para las líneas de entrada
  });

  // Crear el enlace de descarga
  const link = document.createElement("a");
  link.download = "result.jpg";
  link.href = canvas.toDataURL("image/jpeg");
  link.click();
}
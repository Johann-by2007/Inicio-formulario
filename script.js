const form = document.getElementById("loginForm");
const usuario = document.getElementById("usuario");
const email = document.getElementById("email");
const password = document.getElementById("password");

const userError = document.getElementById("userError");
const emailError = document.getElementById("emailError");
const passStrength = document.getElementById("passStrength");
const contador = document.getElementById("contador");
const formMsg = document.getElementById("formMsg");

let intentos = 0;
let bloqueado = false;

function validarUsuario() {
  const regex = /^[a-zA-Z0-9.-]{3,}$/;
  if (!regex.test(usuario.value)) {
    userError.textContent = "Usuario inválido (mín 3 caracteres, solo letras/números/.-)";
    return false;
  }
  userError.textContent = "";
  return true;
}

function validarEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.value)) {
    emailError.textContent = "Correo electrónico no válido";
    return false;
  }
  emailError.textContent = "";
  return true;
}

document.getElementById("togglePass").addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

password.addEventListener("input", () => {
  contador.textContent = password.value.length;
  validarFortaleza();
});

function validarFortaleza() {
  const pass = password.value;
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 1)
    passStrength.textContent = "Débil";
  else if (score === 2)
    passStrength.textContent = "Media";
  else
    passStrength.textContent = "Fuerte";
}

function resultadoEnvio(exito) {
  if (exito) {
    formMsg.textContent = "Formulario enviado correctamente ✔";
    formMsg.className = "success";
    form.reset();
    contador.textContent = "0";
    passStrength.textContent = "";
    userError.textContent = "";
    emailError.textContent = "";
  } else {
    intentos++;
    formMsg.textContent = "Datos incorrectos — intento fallido";
    formMsg.className = "fail";
    if (intentos >= 3) {
      bloquearFormulario();
    }
  }
}

function bloquearFormulario() {
  bloqueado = true;
  usuario.disabled = true;
  email.disabled = true;
  password.disabled = true;

  formMsg.textContent = "Formulario bloqueado por 30 segundos";
  formMsg.className = "fail";

  setTimeout(() => {
    bloqueado = false;
    intentos = 0;
    usuario.disabled = false;
    email.disabled = false;
    password.disabled = false;
    formMsg.textContent = "Formulario desbloqueado ✔";
    formMsg.className = "success";
  }, 30000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (bloqueado) return;
  const okUser = validarUsuario();
  const okEmail = validarEmail();
  resultadoEnvio(okUser && okEmail);
});

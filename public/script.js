// Cambiar entre formularios
document.getElementById('showRegister').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('registerContainer').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('registerContainer').style.display = 'none';
  document.getElementById('loginContainer').style.display = 'block';
});

// Manejador de registro
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    birthdate: formData.get("birthdate"),
  };

  try {
    const res = await fetch("/users/register", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || "Registered");
  } catch (err) {
    alert("Network error, please try again later.");
  }
});

// Manejador de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/users/login", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      // Save token and basic info in Local Storage
      localStorage.setItem("token", result.token);
      localStorage.setItem("email", result.user.email);
      localStorage.setItem("firstname", result.user.firstname);
      if (result.user._id) {
        localStorage.setItem("userId", result.user._id); // <--- GUARDAR USER ID
      }
      console.log(localStorage.getItem("token"));
      alert(`Welcome, ${result.user.firstname}`);
      window.location.href = "/dashboard.html";
    } else {
      alert(result.message || "Login failed");
    }
  } catch (err) {
    alert("Network error, please try again later.");
  }
});

// Verificar si el usuario está autenticado solo en dashboard.html
document.addEventListener("DOMContentLoaded", () => {
  const isDashboard = window.location.pathname.includes("dashboard.html");
  if (isDashboard) {
    const firstname = localStorage.getItem("firstname");
    const email = localStorage.getItem("email");
    // Si quieres mostrar el userId, también puedes obtenerlo así:
    // const userId = localStorage.getItem("userId");
    if (firstname && email) {
      document.getElementById("welcomeMessage").textContent = `Welcome, ${firstname} (${email})`;
    } else {
      alert("User not logged in");
      window.location.href = "/index.html";
    }
  }
});

// Manejador de registro
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(result.message || "Registered");
});

// Manejador de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  
  if (res.ok) {
    console.log("TOKEN:", result.token); // ✅ Imprime el token
    // Guardar el token y el nombre del usuario en Local Storage
    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.user.firstname);

    alert(`Welcome, ${result.user.firstname}`);
    window.location.href = "/dashboard.html"; // ✅ Redirigir a dashboard.html
  } else {
    alert(result.message || "Login failed");
  }
});

// Verificar si el usuario está autenticado solo en dashboard.html
document.addEventListener("DOMContentLoaded", () => {
  const isDashboard = window.location.pathname.includes("dashboard.html");
  if (isDashboard) {
    const username = localStorage.getItem("username");
    if (username) {
      document.getElementById("welcomeMessage").textContent = `Welcome, ${username}`;
    } else {
      alert("User not logged in");
      window.location.href = "/index.html"; // Redirigir al login si no está autenticado
    }
  }
});

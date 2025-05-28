const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Importando las rutas de usuarios
const flatRoutes = require("./routes/flatRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "public")));

// Rutas de autenticación
app.use("/api", authRoutes);

// Rutas de usuarios
app.use("/users", userRoutes); // ✅ Definiendo las rutas de usuarios
app.use("/flats", flatRoutes);

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/loginApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB is connected");
}).catch((err) => {
  console.error("Error de conexión:", err);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

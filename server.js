const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Importando las rutas de usuarios
const flatRoutes = require("./routes/flatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "public")));

// Rutas de autenticación
app.use("/api", authRoutes);

// Rutas de usuarios
app.use(userRoutes);
app.use("/flats", flatRoutes);
app.use(messageRoutes);

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

const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

exports.verifyToken = (req, res, next) => {
  // Siempre en minúscula
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  // Debe ser 'Bearer <token>'
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("Invalid token format:", authHeader);
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = parts[1];

  // Log para verificar el token recibido
  console.log("Token recibido:", token);

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.log("Error de autenticación:", err.message);
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.user = decoded; // tendrás req.user.id, etc.
    next();
  });
};

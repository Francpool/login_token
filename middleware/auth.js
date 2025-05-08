// middleware/auth.js
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const parts = token.split(" ");
  let jwtToken = token;
  if (parts.length === 2 && parts[0] === "Bearer") {
    jwtToken = parts[1];
  }

  // Log para verificar el token recibido
  console.log("Token recibido:", jwtToken);

  jwt.verify(jwtToken, jwtSecret, (err, decoded) => {
    if (err) {
      console.log("Error de autenticación:", err.message);
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

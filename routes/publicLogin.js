var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/loginModel");

router.post("/public-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por username y validar la contraseña
    const user = await User.getPublicUser(email, password);
    // console.log(user);

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Crear y enviar el token JWT
    const token = jwt.sign({ id: user.email }, "secretKey", {
      expiresIn: "1h",
    });

    // Establecer la sesión como iniciada
    req.session.isLogged = true;

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
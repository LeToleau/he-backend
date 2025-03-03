const express = require("express");
const router = express.Router();
const pool = require("../models/dbConnection");
// const nodemailer = require('nodemailer');
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const matchPost = require("../models/createMatchModel");
const authMiddleware = require("../middlewares/auth");
const { notifyInvitationUpdate } = require("../socketService");
const cloudinary = require('../cloudinaryConfig');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Crear instancia de DOMPurify
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

/*
const transporter = nodemailer.createTransport({
    host: 'mail.lbcontest.it',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
});
*/

/*
const getWeekOfYear = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
};

const sendPrizeEmail = async (email, prize, code, image) => {
    const mailOptions = {
        from: 'no-reply@laurabiagiottiparfums.com',
        to: email,
        subject: 'Congratulazioni! Hai vinto un premio con Laura Biaggioti Parfums',
        html: `
        <div id="mail" style="background-color: #fff5ef;color: #303133;width: 600px;margin: 0 auto;font-family: Arial, Helvetica, sans-serif;">
            <div id="mail-heading">
                <div id="mail-logo-wrapper" style="display: flex;background-color: white;padding: 45px;">
                    <img src="https://lbcontest.it/assets/mail-logo.png" style="margin: auto" />
                </div>
                <img src="https://lbcontest.it/assets/${image}.png" style="width: 100%;" />
            </div>
            <div id="mail-body" style="background-color: #FFF5EF;padding: 64px 30px 71px;text-align: center;">
            <div id="mail-body-title" style="display: flex;margin: 0 auto 40px;filter: drop-shadow(2px 4px 6px black);max-width: max-content">
                <h1 style="font-size: 26px;line-height: 0;color: #000000">CONGRATULAZIONI!</h1>
                <img src="https://lbcontest.it/assets/cheers-icon.png" />
            </div>
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">HAI VINTO ${prize}</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">È con piacere che ti confermiamo che sei stato il fortunato vincitore del contest Indovina le note e vinci.</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Verrai presto contattato dal team Laura Biagiotti Parfums che ti invierà le indicazioni per ricevere il tuo premio.</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Nel frattempo ti inviamo il codice di riferimento del premio, che servirà per verificare l’assegnazione. Ti consigliamo di custodirlo!</p>
            <div id="mail-code" style="padding: 15px 40px;background-color: white;margin: 40px auto;width: max-content;border: 1px solid #000000;">
                <p style="margin: 0;font-weight: 600;">Cocide del premio:</p> 
                <span style="font-size: 16px;line-height: 24px;">${code}</span>
            </div>
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Ti ringraziamo per aver partecipato al concorso e ci auguriamo che ti sia piaciuta la nuova collezione AQVE ROMANE.</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Resta in contatto con noi tramite i profili Facebbok e Instagram Laura Biagiotti Parfums e facci sapere quale è la tua fraganza preferita. </p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Grazie e a presto! 
                Il tuo team 
                LAURA BIAGIOTTI PARFUMS
            </p>
            </div>
            <div id="mail-footer">
                <div id="mail-footer-logo" style="display: flex;background-color: #ffffff;padding: 45px;border-top: 1px solid #444444;border-bottom: 1px solid #444444;">
                    <img src="https://lbcontest.it/assets/mail-logo.png" style="margin:auto" />
                </div>
                <div id="mail-footer-bottom" style="display: block;padding: 50px 30px 14px;">
                    <div id="mail-rrss" style="display: flex;margin: auto;width: max-content;margin-bottom: 42px">
                        <p style="font-size: 16px;font-weight: bold;text-transform: uppercase;color: #000000;line-height: 2;">Follow Us:</p>
                        <ul style="display: flex;list-style-type: none;padding-left: 24px;">
                        <li><a href="https://www.facebook.com/laurabiagiottiparfums"><img src="https://lbcontest.it/assets/fb.png" /></a></li>
                        <li style="margin-left: 24px"><a href="https://www.instagram.com/laurabiagiottiparfums/?hl=it"><img src="https://lbcontest.it/assets/ig.png" /></a></li>
                        <li style="margin-left: 24px"><a href="https://www.instagram.com/laurabiagiottiparfums/?hl=it"><img src="https://lbcontest.it/assets/yt.png" /></a></li>
                        </ul>
                    </div>
                    <div id="mail-footer-menu" style="max-width: max-content;margin: auto;">
                        <p style="font-size: 14px;line-height: 22px;color: #444444;text-align: center;">2024 &copy;Laura Biagiotti Parfums.</p>
                        <p style="font-size: 14px;line-height: 22px;color: #444444;text-align: center;"><a href="https://www.laurabiagiottiparfums.com/termini-duso/" style="font-size: 12px;line-height: 22px;color: #444444;">Termini d&lsquo;uso</a> | <a href="https://www.laurabiagiottiparfums.com/privacy-policy/" style="font-size: 12px;line-height: 22px;color: #444444;">Politica sulla privacy</a> | <a href="mailto:info@laurabiagiottiparfums.com" style="font-size: 12px;line-height: 22px;color: #444444;">Contatti</a></p>
                    </div>
                </div>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

*/

router.post("/participants", async (req, res) => {
  try {
    const name = DOMPurify.sanitize(req.body.username);

    const rawPassword = DOMPurify.sanitize(req.body.password);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const mail = DOMPurify.sanitize(req.body.mail);
    const city = DOMPurify.sanitize(req.body.city);
    const position = DOMPurify.sanitize(req.body.position);
    const prefFoot = DOMPurify.sanitize(req.body.prefFoot);

    // const wonGame = req.body.wonGame;

    // const queryCheck = 'SELECT COUNT(*) as count FROM lb_contest_participants WHERE tax_code = ?';

    // const [checkResult] = await pool.query(queryCheck, [taxCode]);
    // const isRegistered = checkResult.count > 0;
    const query = `
        INSERT INTO he_public_users (username, password, email, city, position, preferredFoot)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    const queryProfile = `
      INSERT INTO he_public_profiles (user_id, profile_picture)
      VALUES (?, ?);
    `;
    const result = await pool.query(query, [
      name,
      hashedPassword,
      mail,
      city,
      position,
      prefFoot,
    ]);

    const userId = result.insertId;
    await pool.query(queryProfile, [userId, "profile-picture.svg"]);

    const accessToken = jwt.sign(
      { id: userId, email: mail }, // Payload del token
      process.env.JWT_ACCESS_SECRET, // Clave secreta
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN } // Expiración
    );

    const refreshToken = jwt.sign(
      { id: userId, email: mail },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Configurar las cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // No accesible desde JavaScript
      //secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
      sameSite: "Lax", // Evitar envío en cross-origin requests
      maxAge: 120000, // Expira en 10 seg (en ms)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 3600000, // Expira en 1 hora (en ms)
    });

    res.status(201).json({ success: "success" });
  } catch (err) {
    console.error("Error registering participant:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-user-id", async (req, res) => {
  try {
    const name = DOMPurify.sanitize(req.body.username);

    const rawPassword = DOMPurify.sanitize(req.body.password);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const query = `
        SELECT
        id
        FROM
        he_public_users
        WHERE
        username = ?,
        password = ?
        `;
    const result = await pool.query(query, [name, hashedPassword]);
    res.status(201).json({ success: "success", id: result });
  } catch {
    console.error("Algo salió mal :(");
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario extraído del token

    // Obtener datos del usuario desde la BD
    const query = `SELECT 
      u.id, 
      u.username, 
      u.email, 
      p.profile_picture, 
      p.dominant_leg, 
      p.position, 
      p.body_type, 
      p.height, 
      p.bio, 
      p.prefer_matches
      FROM he_public_users u
      LEFT JOIN he_public_profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `;

    const rows = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/your-matches", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario extraído del token

    // Obtener datos del usuario desde la BD
    const query =
      "SELECT id, match_title, match_type, match_size, schedule, created_at FROM he_matches WHERE creator_id = ? ORDER BY created_at DESC";
    const rows = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hay partidos", matches: [] });
    }

    res.status(200).json({ success: true, matches: rows });
  } catch (error) {
    console.error("Error al obtener los partidos:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/post-match", authMiddleware, async (req, res) => {
  try {
    const title = DOMPurify.sanitize(req.body.title);

    const type = DOMPurify.sanitize(req.body.type);

    const size = DOMPurify.sanitize(req.body.size);

    const schedule = DOMPurify.sanitize(req.body.schedule);

    const userId = req.user.id;

    //const schedule = new Date().toISOString().slice(0, 19).replace('T', ' ');

    matchPost.postNewMatch(
      {
        title: title,
        type: type,
        size: size,
        schedule: schedule,
        creatorId: userId,
      },
      res
    );
  } catch (err) {
    console.error("Error registering participant:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-match/:id", authMiddleware, async (req, res) => {
  try {
    const matchId = req.params.id;

    const query = `SELECT 
      m.id, 
      m.creator_id, 
      m.match_title, 
      m.match_type, 
      m.match_size, 
      m.schedule,
      m.created_at,
      JSON_ARRAYAGG(
        JSON_OBJECT(
            'user_id', p.user_id,
            'role', p.role,
            'status', p.status
        )
      ) AS participants
      FROM he_matches AS m 
      LEFT JOIN he_match_participants AS p ON m.id = p.match_id
      WHERE m.id = ?
      GROUP BY m.id`;
    const rows = await pool.query(query, [matchId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hay partidos" });
    }

    const match = rows[0];
    match.participants = JSON.parse(match.participants);
    res.status(200).json({ success: true, match });
  } catch (err) {
    console.error("Error registering participant:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/user-invitations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario extraído del token

    // Obtener datos del usuario desde la BD
    const query = `SELECT
    m.id, 
    m.creator_id,
    m.match_title, 
    m.match_type, 
    m.match_size, 
    m.schedule, 
    p.id AS invitation_id,
    p.status AS invitation_status, 
    p.invited_by AS invitation_invitor, 
    u1.username AS invitor_username,
    u2.username AS invitee_username,
    CASE 
        WHEN p.user_id = ? THEN 'received' 
        WHEN p.invited_by = ? THEN 'sent' 
    END AS invitation_type
    FROM he_matches AS m 
    JOIN he_match_participants AS p ON m.id = p.match_id 
    LEFT JOIN he_public_users AS u1 ON p.invited_by = u1.id
    LEFT JOIN he_public_users AS u2 ON p.user_id = u2.id
    WHERE p.user_id = ? OR p.invited_by = ?
    ORDER BY m.created_at DESC`;

    const rows = await pool.query(query, [
      userId,
      userId,
      userId,
      userId,
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tienes invitaciones pendientes",
        invitations: [],
      });
    }

    res.status(200).json({ success: true, invitations: rows });
  } catch (error) {
    console.error("Error al obtener las invitaciones:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/notify-invitation/:id", authMiddleware, async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.user.id; // ID del usuario extraído del token
    const invitationId = req.params.id; // ID del usuario extraído del token

    // Obtener datos del usuario desde la BD
    const query = `SELECT
      m.id, 
      m.creator_id, 
      m.match_title,
      m.match_type, 
      m.match_size, 
      m.schedule,
      p.id AS invitation_id,
      p.status AS invitation_status,
      p.invited_by AS invitation_invitor,
      u1.username AS invitor_username,
      u2.username AS invitee_username
      FROM he_match_participants AS p
      JOIN he_matches AS m ON p.match_id = m.id
      LEFT JOIN he_public_users AS u1 ON p.invited_by = u1.id
      LEFT JOIN he_public_users AS u2 ON p.user_id = u2.id
      WHERE p.id = ?
    `;
    const rows = await pool.query(query, [invitationId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tienes invitaciones pendientes",
        invitations: [],
      });
    }

    res.status(200).json({ success: true, invitation: rows });
  } catch (error) {
    console.error("Error al obtener las invitaciones:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

router.put("/accept-invitation/:id", authMiddleware, async (req, res) => {
  const invitationId = req.params.id;
  const invitorId = req.body.invitor;
  const userId = req.user.id;

  try {
    const query = `UPDATE he_match_participants SET status = ? WHERE id = ?`;
    const result = await pool.query(query, ["confirmed", invitationId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontró la invitación" });
    }

    notifyInvitationUpdate(invitorId, {
      type: "accepted_invitation",
      confirmedUser: userId,
      invitationId: invitationId,
    });

    res
      .status(200)
      .json({ success: true, message: "Confirmado", confirmed: true });
  } catch (err) {
    console.error("Error al intentar aceptar invitación:", err);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/public-login", async (req, res) => {
  try {
    const email = DOMPurify.sanitize(req.body.email);
    const password = req.body.password;

    const query = `
        SELECT * FROM he_public_users 
        WHERE 
        email = ?
        LIMIT 1
        `;

    const [rows] = await pool.query(query, [email]);

    if (!rows.email) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const storedPassword = rows.password;

    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    const accessToken = jwt.sign(
      { id: rows.id, email: rows.email }, // Payload del token
      process.env.JWT_ACCESS_SECRET, // Clave secreta
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN } // Expiración
    );

    const refreshToken = jwt.sign(
      { id: rows.id, email: rows.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Configurar las cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // No accesible desde JavaScript
      //secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
      sameSite: "Lax", // Evitar envío en cross-origin requests
      maxAge: 120000, // Expira en 10 seg (en ms)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 3600000, // Expira en 1 hora (en ms)
    });

    res.status(200).json({
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.error("Algo salió mal :(");
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    // Eliminar cookies configurando `maxAge: 0`
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "Lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Lax",
    });

    res.status(200).json({ success: true, message: "Logout exitoso" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ success: false, message: "Error al cerrar sesión" });
  }
});

router.get("/users-to-invite", authMiddleware, async (req, res) => {
  try {
    console.log(req.user)
    const matchId = req.query.match;
    const adminId = req.user.id; // id del usuario que invita, tomado del refreshToken

    const query = `SELECT 
      u.id,
      u.username, 
      u.city, 
      u.position, 
      u.preferredFoot,
      p.status AS invitation_status,
      p2.profile_picture AS profile_pic
      FROM he_public_users AS u
      LEFT JOIN he_match_participants AS p ON u.id = p.user_id AND p.match_id = ${matchId}
      LEFT JOIN he_public_profiles AS p2 ON u.id = p2.user_id
      `;
      //AND p.invited_by = ${adminId} 

    const rows = await pool.query(query);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hay partidos" });
    }

    res.status(200).json({ success: true, users: rows });
  } catch (err) {
    console.error("Error registering participant:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/send-invite/:id", authMiddleware, async (req, res) => {
  const matchId =
    typeof req.params.id === "string" ? parseInt(req.params.id) : req.params.id;
  const userId = req.body.id; // id enviado en el req por un objeto json en el metodo post de Axios
  const invitorId = req.user.id; // id del usuario que invita, tomado del refreshToken
  const invitorUsername = req.user.username;

  const query =
    "INSERT INTO he_match_participants (match_id, user_id, role, status, invited_by) VALUES (?, ?, ?, ?, ?)";
  try {
    const rows = await pool.query(query, [
      matchId,
      userId,
      "participant",
      "invited",
      invitorId,
    ]);

    const invitationId = rows.insertId;

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hay invitados" });
    }

    console.log(`invited id:`);

    notifyInvitationUpdate(userId, {
      type: "invitation_sent",
      invitedBy: invitorId,
      invitationId: invitationId,
      matchId: matchId,
      invitorUsername: invitorUsername,
    });

    res.status(200).json({ success: true, message: "Usuario invitado" });
  } catch (err) {
    console.error("Error sending invite:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/upload-profile", authMiddleware, upload.single("image"), async (req, res) => {
  const userId = req.user.id;
  try {
    const filePath = req.file.path;
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      folder: "profiles",
    });
    
    const query =
    "UPDATE he_public_profiles SET profile_picture = ? WHERE user_id = ?";
    
    const rows = pool.query(query, [uploadResponse.secure_url, userId]);
    
    res.json({ url: uploadResponse.secure_url, success: rows.affectedRows !== 0 ? 'Foto de perfil actualizada con éxito!' : 'No se pudo actualizar la foto de perfil' });

  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});


module.exports = router;

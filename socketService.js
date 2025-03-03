const socketIo = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, { cors: { origin: "http://localhost:5173", credentials: true } });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("joinRoom", (userId) => {
      console.log(`Usuario ${userId} se unió a la sala`);
      socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};

const notifyInvitationUpdate = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit("invitationUpdate", notification);
    console.log("notificated");
  } else {
    console.error("Socket.io no ha sido inicializado correctamente");
    console.log("notificated");
  }
};

module.exports = { initializeSocket, notifyInvitationUpdate };
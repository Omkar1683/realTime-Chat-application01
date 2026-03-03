const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Track online users: { userId -> socketId }
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Register user as online
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(onlineUsers));
    console.log(`User ${userId} is online`);
  });

  // Handle sending messages
  socket.on("sendMessage", (message) => {
    const receiverSocketId = onlineUsers[message.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );
    if (userId) {
      delete onlineUsers[userId];
      io.emit("onlineUsers", Object.keys(onlineUsers));
      console.log(`User ${userId} went offline`);
    }
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = server;

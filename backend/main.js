require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/connection');
const Todo = require('./models/Todo');

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "*", // or your domain if you want to lock it down
    methods: ["GET", "POST"],
  },
})

// if you're behind nginx or any reverse proxy:
app.set("trust proxy", 1)


const PORT = process.env.PORT || 5000;


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});





app.post("/api/play-sound", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  io.emit("playSound", { message });

  res.json({ success: true, message: "Sound play request sent", data: message });

});









app.get("/api/test", (req, res) => {
  res.send("Test is successful");
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

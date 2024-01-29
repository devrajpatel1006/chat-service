const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const users = require("./routes/api/users.routes");
const groups = require("./routes/api/groups.routes");
const chat = require("./routes/api/chat.routes");
const auth = require("./routes/api/auth.routes");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const authMiddleware = require("./middleware/auth.middleware");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");

const server = http.createServer(app);
const io = socketIO(server);

app.use(cookieParser());

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Connect Database
connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Additional middleware for extended urlencoded data
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  if (req.cookies.userData) {
    res.redirect("/api/chat");
  } else {
    res.render("index");
  }
});

app.use("/api/auth", auth);
app.use("/api/users", authMiddleware, users);
app.use("/api/groups", authMiddleware, groups);
app.use("/api/chat", chat);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 8082;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (groupId) => {
    socket.join(groupId);
    // console.log(`User joined room: ${groupId}`);
  });

  socket.on("groupMessage", (data) => {
    const { groupId } = data;
    io.to(groupId).emit("groupMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));

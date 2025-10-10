const express = require("express");

const cors = require("cors");
const {PORT} = require("./config");

const mysqlConnection = require('./connection');

const RoomRouter = require("./routes/rooms");
const UserRouter = require("./routes/user");
const ChatRouter = require("./routes/chat");

const rooms = require("./data/RoomData");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/rooms", RoomRouter);
app.use("/user", UserRouter);
app.use("/api/chat", ChatRouter);

app.get("/", (req, res) => {
  res.send("api running!");
});


app.listen(
  PORT,
  console.log(`App running on port ${PORT}`)
);

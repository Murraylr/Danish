import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import express, { Request } from "express";
import { InitialiseConnection } from "./socketFunctions";
import { SocketEvents } from "./src/models/socketEvents";
import cors from "cors";
import session from "express-session";
import path from "path";
import { v4 as uuidv4 } from "uuid";

declare module "express-session" {
  interface SessionData {
    playerId: string;
  }
}

const app = express();
const sessionMiddleware = session({
  secret: "fhdfhdfgjjbjakslkfkadgbjewlkgnkjwekrj;oq kpeo20385983409ptymn4 2ei8psu099g05oihyt983409",
  resave: true,
  saveUninitialized: true,
  store: new session.MemoryStore(),
});
app.use(sessionMiddleware);
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

var clientPath =
  process.env.ENVIRONMENT === "prod"
    ? path.join(__dirname, "client")
    : path.join(__dirname, "build", "client");

app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
  } else {
    console.log("Here, session id: ", req.session.playerId);
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    req.session.save();
    if (!(req.session || {}).playerId) {
      // generate guid
      req.session.reload((err) => {
        if (err) {
          console.log("error reloading session: ", err);
        }
        console.log("setting session id");
        req.session.playerId = uuidv4();
      });
    }
    res.sendFile(path.join(clientPath, "index.html"));
  }
});

app.use(express.static(clientPath));
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  }
});
io.engine.use(sessionMiddleware);

io.on("connection", (socket: Socket) => {
  const request = socket.request as Request;
  request.session.save();

  if (!request.session.playerId) {
    return;
  }

  console.log("a user connected with sessionID: ", request.session.playerId);
  let connection = InitialiseConnection(socket, io, request.session.playerId);

  socket.on(SocketEvents.SendMessage, connection.sendMessage);
  socket.on(SocketEvents.JoinRoom, connection.joinRoom);
  socket.on(SocketEvents.StartGame, connection.startGame);
  socket.on(SocketEvents.LeaveRoom, connection.leaveRoom);
  socket.on(SocketEvents.MarkReady, connection.markReady);
  socket.on(SocketEvents.PlayCard, connection.playCards);
  socket.on(SocketEvents.GetMe, connection.getMe);
  socket.on(SocketEvents.SelectBestCard, connection.selectBestCard);
  socket.on(SocketEvents.SelectNomination, connection.selectNomination);
  socket.on(SocketEvents.PickUp, connection.pickUp);

  if (process.env.ENVIRONMENT === "dev") {
    socket.on(SocketEvents.SetTest, connection.setTest);
  }
});

let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

export {};

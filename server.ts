import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import express, { Request } from "express";
import { InitialiseConnection } from "./socketFunctions";
import { SocketEvents } from "./src/models/socketEvents";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import cookie from "cookie";
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
  secret: "keyboard cat",
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

console.log("Environment: ", process.env.ENVIRONMENT);



console.log("Client path: ", clientPath);

app.use(express.static(clientPath));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
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
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

export {};

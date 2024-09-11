import { Server, Socket } from "socket.io";
import { JoinRoomModel } from "./src/models/joinRoomModel";
import { Player } from "./src/models/player";
import { RoomManager } from "./src/services/roomManager/roomManager";
import { SocketEvents } from "./src/models/socketEvents";
import { Turn } from "./src/models/turn";
import { ChatMessage } from "./src/models/chatMessage";
import { GetMeModel, PlayerReady } from "./src/models/playerUpdate";
import { BestCardSelection } from "./src/models/bestCardSelection";
import { Nomination } from "./src/models/nomination";
import { PickUpModel } from "./src/models/pickUpModel";

const roomManager = new RoomManager();

export function InitialiseConnection(
  socket: Socket,
  io: Server,
  playerId: string
) {
  function updateClient(roomName: string) {
    let room = roomManager.getRoom(roomName);

    io.to(roomName).emit(
      SocketEvents.GameUpdate,
      room?.gameManager.getGameState()
    );
    for (let [id, player] of room!.gameManager.players) {
      io.to(`${roomName}/${id}`).emit(
        SocketEvents.PlayerUpdate,
        room?.gameManager.getPlayerState(player)
      );
    }
  }

  function startGame(roomName: string) {
    let gameRoom = roomManager.getRoom(roomName);
    gameRoom?.gameManager.startGame();
    updateClient(roomName);
  }

  function leaveRoom(room: JoinRoomModel) {
    let gameRoom = roomManager.getRoom(room.roomName);
    gameRoom?.gameManager.markDisconnected(playerId);
    socket.leave(room.roomName);
    socket.leave(`${room.roomName}/${playerId}`);
    updateClient(room.roomName);
    gameRoom?.addSystemMessage(`${room.playerName} has left the room`);
    io.to(room.roomName).emit(SocketEvents.MessageSent, gameRoom?.messages);
  }

  return {
    joinRoom: function (roomModel: JoinRoomModel) {
      let room = roomManager.getRoom(roomModel.roomName);
      if (!room) {
        room = roomManager.createRoom(roomModel.roomName);
      }
      let player: Player;

      if (room.gameManager.players.has(playerId)) {
        player = room.gameManager.players.get(playerId)!;
        player.connected = true;
      } else {
        player = new Player(playerId, roomModel.playerName!);
        room.addPlayer(player);
      }

      socket.join(roomModel.roomName);
      socket.join(`${roomModel.roomName}/${playerId}`);
      updateClient(roomModel.roomName);
      io.to(`${room.roomName}/${playerId}`).emit(SocketEvents.RoomJoined, roomModel);
      room.addSystemMessage(`${roomModel.playerName} has joined the room`);
      io.to(room.roomName).emit(SocketEvents.MessageSent, room.messages);

      socket.on("disconnect", () => {
        leaveRoom(roomModel);
      });
    },

    leaveRoom,

    markReady: function (playerReady: PlayerReady) {
      let gameRoom = roomManager.getRoom(playerReady.roomName);
      if (!gameRoom) {
        return;
      }

      gameRoom.gameManager.markPlayerReady(
        playerReady.playerId,
        playerReady.ready
      );

      let player = gameRoom?.gameManager.players.get(playerReady.playerId);
      gameRoom.addSystemMessage(
        playerReady.ready
          ? `Player ${player?.name} is ready`
          : `Player ${player?.name} has cancelled ready`
      );
      updateClient(playerReady.roomName);

      io.to(gameRoom.roomName).emit(
        SocketEvents.MessageSent,
        gameRoom?.messages
      );

      if (gameRoom?.gameManager.playerArray().every((player) => player.ready)) {
        startGame(playerReady.roomName);
      }
    },

    startGame,

    sendMessage: function (message: ChatMessage) {
      let room = roomManager.getRoom(message.roomName);
      if (!room) {
        return;
      }
      room.addMessage(message.sender, message.message);
      io.emit(SocketEvents.MessageSent, room.messages);
    },

    playCards: function (turn: Turn) {
      let gameRoom = roomManager.getRoom(turn.room.roomName);
      let player = gameRoom?.gameManager.players.get(turn.playerId);

      if (!player) {
        return;
      }

      gameRoom?.gameManager.playCards(player, turn.cards);
      
      updateClient(turn.room.roomName);
    },

    selectBestCard: function (bestCard: BestCardSelection) {
      let gameRoom = roomManager.getRoom(bestCard.roomName);
      let player = gameRoom?.gameManager.players.get(bestCard.playerId);

      if (!player) {
        return;
      }

      gameRoom?.gameManager.selectBestCards(bestCard.playerId, bestCard.cards);

      if (gameRoom?.gameManager.playerArray().every((player) => player.bestCards.length === 3)) {
        gameRoom?.gameManager.setStartingPlayers();
      }

      updateClient(bestCard.roomName);
    },

    getMe: function (getMeModel: GetMeModel) {
      let gameRoom = roomManager.getRoom(getMeModel.roomName);
      let player = gameRoom?.gameManager.players.get(getMeModel.playerId);

      if (!player) {
        return;
      }
      io.to(`${getMeModel.roomName}/${getMeModel.playerId}`).emit(
        SocketEvents.PlayerUpdate,
        gameRoom?.gameManager.getPlayerState(player)
      );
    },

    selectNomination: function (nomination: Nomination) {
      let gameRoom = roomManager.getRoom(nomination.roomName);
      let player = gameRoom?.gameManager.players.get(nomination.playerId);

      if(!player) {
        return;
      }

      gameRoom?.gameManager.handleNomination(player, nomination.nominatedPlayerId);
      updateClient(nomination.roomName);
    },

    pickUp: function (pickUpModel: PickUpModel) {
      let gameRoom = roomManager.getRoom(pickUpModel.roomName);
      let player = gameRoom?.gameManager.players.get(pickUpModel.playerId);

      if (!player) {
        return;
      }

      gameRoom?.gameManager.pickUpPile(player);
      updateClient(pickUpModel.roomName);
    }
  };
}

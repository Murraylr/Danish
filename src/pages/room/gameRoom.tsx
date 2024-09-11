import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import Game from "../../components/game/game";
import ChatBox from "../../components/chatBox/chatBox";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import { selectRoomModel } from "../../redux/combineSelectors";
import { selectPlayerState } from "../../redux/playerState/playerStateSlice";
import { selectMessages } from "../../redux/messagesState/messagesStateSlice";

interface GameRoomProps {}

const GameRoom: React.FC<GameRoomProps> = ({}) => {
  const roomModel = selectRoomModel();
  const hasJoinedRoom = useRef(false);
  const gameState = selectGameState();
  const playerState = selectPlayerState();
  const messages = selectMessages();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomModel || hasJoinedRoom.current) {
      return;
    }
    socket.emit(SocketEvents.JoinRoom, roomModel);
    hasJoinedRoom.current = true;
  }, [roomModel, hasJoinedRoom]);

  if (!roomModel?.roomName || !roomModel.playerName) {
    navigate("/");
  }

  if (!playerState || !gameState) {
    return null;
  }

  return (
    <div style={gameRoomContainer}>
      {roomModel?.roomName}
      {gameState && playerState && (
        <Game gameState={gameState} playerState={playerState} />
      )}

      <ChatBox chatHistory={messages} me={playerState.me} />
      <div>
        <h2>Players In Room</h2>
        {gameState.players.map((player) => {
          return (
            <div key={player.name}>
              {player.name}: {player.status}
            </div>
          );
        })}
      </div>
      {playerState.me.ready}
      <button
        onClick={() =>
          socket.emit(SocketEvents.MarkReady, {
            roomName: roomModel!.roomName,
            playerId: playerState!.me.playerId,
            ready: playerState.me.ready ? false : true,
          })
        }
      >
        {playerState.me.ready ? "Cancel" : "Ready"}
      </button>
    </div>
  );
};

const gameRoomContainer: React.CSSProperties = {
  maxHeight: "100vh",
};

export default GameRoom;

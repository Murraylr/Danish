import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionStorage } from "../../services/sessionStorage/sessionStorage";

interface RoomCreatorProps {
  // Add any props you need here
  navigator: any;
}

const RoomCreator: React.FC<RoomCreatorProps> = ({}: RoomCreatorProps) => {
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handlePlayerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlayerName(event.target.value);
  };

  const handleJoinRoom = () => {
    SessionStorage.SetPlayerName(playerName);
    navigate(`Room/${roomName}`);
  };

  return (
    <div>
      <h2>Create or Join a Game Room</h2>
      <form onSubmit={handleJoinRoom}>
        <label>
          Room Name:
          <input type="text" value={roomName} onChange={handleRoomNameChange} />
        </label>
        <label>
          Player Name:
          <input
            type="text"
            value={playerName}
            onChange={handlePlayerNameChange}
          />
        </label>
        <button type="submit">Create/Join Room</button>
      </form>
    </div>
  );
};

export default RoomCreator;

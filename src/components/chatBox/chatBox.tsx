import React, { useState } from "react";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { ChatMessage } from "../../models/chatMessage";
import { Player, VisiblePlayer } from "../../models/player";
import { selectRoom } from "../../redux/roomState/roomStateSlice";

interface ChatBoxProps {
  chatHistory: ChatMessage[];
  me: VisiblePlayer;
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatHistory, me }) => {
  const [inputValue, setInputValue] = useState("");
  const room = selectRoom();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      let message: ChatMessage = {
        sender: me.name || "Unknown",
        message: inputValue,
        roomName: room?.roomName,
      };
      socket.emit(SocketEvents.SendMessage, message);
      setInputValue("");
    }
  };

  return (
    <div>
      <div>
        {chatHistory.map((message, index) => (
          <div key={index}>
            <b>{message.sender}</b>: {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;

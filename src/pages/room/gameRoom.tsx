/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import ChatBox from "../../components/chatBox/chatBox";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import { selectRoomModel } from "../../redux/combineSelectors";
import {
  selectInvalidAction,
  selectPlayerState,
} from "../../redux/playerState/playerStateSlice";
import { selectMessages } from "../../redux/messagesState/messagesStateSlice";
import {
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  Layout,
  Modal,
  notification,
} from "antd";
import MyCards from "../../components/myCards/myCards";
import DiscardPile from "../../components/discardPile/discardPile";
import OpponentDeck from "../../components/opponentDeck/opponentDeck";
import { Card } from "antd";
import { GameState } from "../../models/gameState";
import { PlayerState } from "../../models/playerUpdate";
import { Room } from "../../models/room";
import { JoinRoomModel } from "../../models/joinRoomModel";
import { ChatMessage } from "../../models/chatMessage";
import { set } from "lodash";
import Deck from "../../components/deck/deck";
import { TestParameters } from "../../models/testParameters";
import DeveloperForm from "../../components/developerForm/developerForm";

const { Header, Footer, Sider, Content } = Layout;

interface GameRoomProps {}

interface CardTab {
  key: string;
  tab: string;
  render: (
    gameState: GameState,
    playerState: PlayerState,
    roomModel: JoinRoomModel,
    messages?: ChatMessage[]
  ) => React.ReactNode;
}

const tabList: Map<string, CardTab> = new Map();
tabList.set("players", {
  key: "players",
  tab: "Players",
  render: (
    gameState: GameState,
    playerState: PlayerState,
    roomModel: JoinRoomModel
  ) => {
    return (
      <>
        <h2>Players In Room</h2>
        {gameState.players.map((player) => {
          return (
            <div key={player.name}>
              {player.name}: {player.status}
            </div>
          );
        })}
        {playerState.me.ready}
        <Button
          onClick={() =>
            socket.emit(SocketEvents.MarkReady, {
              roomName: roomModel!.roomName,
              playerId: playerState!.me.playerId,
              ready: playerState.me.ready ? false : true,
            })
          }
        >
          {playerState.me.ready ? "Cancel" : "Ready"}
        </Button>
      </>
    );
  },
});

tabList.set("chat", {
  key: "chat",
  tab: "Chat",
  render(gameState, playerState, roomModel, messages) {
    return <ChatBox chatHistory={messages} me={playerState.me} />;
  },
});

tabList.set("controls", {
  key: "controls",
  tab: "Controls",
  render(gameState, playerState, roomModel) {
    return (
      <Flex vertical>
        <Button
          onClick={() => {
            socket.emit(SocketEvents.StartGame, roomModel.roomName);
          }}
        >
          Restart game
        </Button>
        <Button
          onClick={() => {
            socket.emit(SocketEvents.StartGame, roomModel.roomName);
          }}
        >
          Leave room
        </Button>
      </Flex>
    );
  },
});

tabList.set("history", {
  key: "history",
  tab: "History",
  render(gameState, playerState, roomModel) {
    return (
      <Flex vertical>
        <h2>Game History</h2>
        {gameState.history.map((history, index) => (
          <div key={index}>
            {history?.player?.name} {history.message}
          </div>
        ))}
      </Flex>
    );
  },
});

tabList.set("developer", {
  key: "developer",
  tab: "Developer",
  render: (gameState, playerState, roomModel) => {
    return <DeveloperForm />;
  },
});

const GameRoom: React.FC<GameRoomProps> = ({}) => {
  const roomModel = selectRoomModel();
  const hasJoinedRoom = useRef(false);
  const gameState = selectGameState();
  const playerState = selectPlayerState();
  const messages = selectMessages();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = useState<string>("players");
  const [victoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [defeatModalOpen, setIsDefeatModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const invalidPlay = selectInvalidAction();

  useEffect(() => {
    if (!invalidPlay) {
      return;
    }

    api.error({
      message: "Cannot play card",
      description: invalidPlay.message,
    });
  }, [invalidPlay]);

  const winPosition = useMemo(() => {
    if (!playerState || !gameState) {
      return 0;
    }
    return gameState.getWinPosition(playerState.me);
  }, [gameState?.winners, playerState?.me]);

  const hasShownEndModal = useRef(false);

  useEffect(() => {
    if (winPosition === 0 || hasShownEndModal.current) {
      return;
    }
    
    hasShownEndModal.current = true;
    if (gameState.players.length > 0) {
      setIsVictoryModalOpen(true);
    } else {
      setIsDefeatModalOpen(true);
    }
  }, [winPosition]);

  const onTabChange = useCallback((key: string) => {
    setActiveTabKey(key);
  }, []);

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
    <Flex vertical>
      <Header style={headerStyle}>Room: {roomModel.roomName}</Header>
      <Flex>
        <Flex flex={1} vertical justify="space-between">
          <Flex
            style={opponentsContainer}
            justify="space-evenly"
            flex={"0 0 10em"}
          >
            {playerState.otherPlayers.map((player, index) => (
              <OpponentDeck
                opponentName={player.name}
                blindCards={player.blindCards}
                bestCards={player.bestCards}
                hand={player.cardsHeld}
              />
            ))}
          </Flex>

          <Flex>
            <Flex style={middleContainer}>
              <DiscardPile cards={gameState.discardPile} />
              <Deck deckNumber={gameState.pickupDeckNumber} />
            </Flex>
            <Flex vertical>
              <Card
                style={{ width: "100%" }}
                tabList={Array.from(tabList.values())}
                activeTabKey={activeTabKey}
                onTabChange={onTabChange}
              >
                {tabList
                  .get(activeTabKey)
                  ?.render(gameState, playerState, roomModel, messages)}
              </Card>
            </Flex>
          </Flex>
          <Flex justify="space-evenly">
            <MyCards cards={playerState.hand} />
          </Flex>

          <Modal
            title="Victory!"
            open={victoryModalOpen}
            onOk={() => setIsVictoryModalOpen(false)}
          >
            <p>
              All hail the mightiest of winners! Your position: {winPosition}
            </p>
          </Modal>
          <Modal
            title="Defeat!"
            open={defeatModalOpen}
            onOk={() => setIsDefeatModalOpen(false)}
          >
            Shame and dishonour on your family! You have lost against the might
            of your opponent.
          </Modal>
        </Flex>
      </Flex>
    </Flex>
  );
};

const middleContainer: React.CSSProperties = {
  justifyContent: "center",
  flexGrow: 1,
};

const opponentsContainer: React.CSSProperties = {
  maxHeight: "25vh",
};

const myContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
};

const gameRoomContainer: React.CSSProperties = {
  maxHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

export default GameRoom;

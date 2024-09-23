/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
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
  Space,
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
import { selectWinners } from "../../redux/winnerStateSlice/winnerStateSlice";
import { CannotPlayCard } from "../../models/cannotPlayCardModel";
import HistoryTab from "../../components/historyTab/historyTab";
import PlayArea from "../../components/playArea/playArea";

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
    return <HistoryTab history={gameState.history} />;
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
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const victors = useRef(0);
  const winners = selectWinners();
  const [nameForm] = Form.useForm();

  useEffect(() => {
    socket.on(
      SocketEvents.CannotPlayCard,
      (cannotPlayCardModel: CannotPlayCard) => {
        api.error({
          message: "Cannot play card",
          description: cannotPlayCardModel.message,
          placement: "topRight",
        });
      }
    );
  }, []);

  useEffect(() => {
    if (!winners || winners.winnerIds.length === 0) {
      return;
    }

    if (!playerState?.me?.playerId) {
      return null;
    }

    if (victors.current === winners.winnerIds.length) {
      return;
    }

    let victorId = winners.winnerIds[victors.current++];
    let victor = playerState.otherPlayers.find((p) => p.playerId === victorId);
    if (victor) {
      api.success({
        message: "Victory!",
        description: `${victor?.name} has won the game!`,
        placement: "topRight",
      });
    }

    if (winners.winnerIds.includes(playerState?.me.playerId)) {
      setIsVictoryModalOpen(true);
    } else if (playerState?.me.playerId) {
      setIsDefeatModalOpen(true);
    }
  }, [winners, playerState]);

  const onTabChange = useCallback((key: string) => {
    setActiveTabKey(key);
  }, []);

  const joinroom = useCallback((model: JoinRoomModel) => {
    socket.emit(SocketEvents.JoinRoom, model);
    hasJoinedRoom.current = true;
    sessionStorage.setItem("playerName", model.playerName);
  }, []);

  useEffect(() => {
    if (!roomModel?.playerName || hasJoinedRoom.current) {
      return;
    }
    joinroom(roomModel);
  }, [roomModel, hasJoinedRoom]);

  if (!roomModel?.roomName) {
    navigate("/");
  }

  if (!roomModel.playerName && !nameModalOpen) {
    setNameModalOpen(true);
  }

  return (
    <Flex vertical>
      <Header style={headerStyle}>Room: {roomModel.roomName}</Header>
      <Flex>
        <Flex flex={1} vertical justify="space-between">
          {gameState && playerState && (
            <>
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
                <div style={playAreaSection} />
                <PlayArea style={{ flex: 2 }} />
                <Flex style={{...playAreaSection, maxWidth: '40vw'}} vertical>
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
              <Flex justify="center" flex={1}>
                <MyCards cards={playerState.hand} />
              </Flex>
            </>
          )}
          {contextHolder}
          <Modal
            title="Victory!"
            open={victoryModalOpen}
            onOk={() => {
              setIsVictoryModalOpen(false);
              socket.emit(SocketEvents.RestartGame, roomModel.roomName);
            }}
            okText="Rematch"
            cancelText="Bow before me mortals!"
            onCancel={() => setIsVictoryModalOpen(false)}
          >
            <p>All hail the mightiest of winners!</p>
          </Modal>
          <Modal
            title="Defeat!"
            open={defeatModalOpen}
            onOk={() => {
              setIsDefeatModalOpen(false);
              socket.emit(SocketEvents.RestartGame, roomModel.roomName);
            }}
            okText="Rematch"
            cancelText="Stop! I yield to your superior skills!"
            onCancel={() => setIsDefeatModalOpen(false)}
          >
            Shame and dishonour on your family! You have lost against the might
            of your opponent.
          </Modal>

          <Modal
            title="Please enter your name"
            open={nameModalOpen}
            onOk={() => {
              nameForm.validateFields().then(() => {
                let name = nameForm.getFieldValue("name");
                joinroom({ ...roomModel, playerName: name });
                setNameModalOpen(false);
              });
            }}
            onCancel={() => {
              setNameModalOpen(false);
              navigate("/");
            }}
            okText="Submit"
          >
            <Form form={nameForm} layout="vertical">
              <Form.Item
                label="Name"
                name="name"
                required
                rules={[{ required: true, message: "Please enter a name." }]}
              >
                <Input />
              </Form.Item>
            </Form>
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

const gameRoomContainer: React.CSSProperties = {
  maxHeight: "100vh",
};

const playAreaSection: React.CSSProperties = {
  flex: "1"
}

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

export default GameRoom;

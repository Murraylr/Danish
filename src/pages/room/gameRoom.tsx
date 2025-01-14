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
  Menu,
  Modal,
  notification,
  Space,
} from "antd";
import MyCards from "../../components/myCards/myCards";
import DiscardPile from "../../components/discardPile/discardPile";
import OpponentDeck from "../../components/opponentDeck/opponentDeck";
import { Card } from "antd";
import { GameState } from "../../models/gameState";
import { GetMeModel, PlayerState } from "../../models/playerUpdate";
import { Room } from "../../models/room";
import { JoinRoomModel } from "../../models/joinRoomModel";
import { ChatMessage } from "../../models/chatMessage";
import { set } from "lodash";
import Deck from "../../components/deck/deck";
import { TestParameters } from "../../models/testParameters";
import DeveloperForm from "../../components/developerForm/developerForm";
import {
  selectWinners,
  winnerStateActions,
} from "../../redux/winnerStateSlice/winnerStateSlice";
import { CannotPlayCard } from "../../models/cannotPlayCardModel";
import HistoryTab from "../../components/historyTab/historyTab";
import PlayArea from "../../components/playArea/playArea";
import { useDispatch } from "react-redux";
import MyHeader from "../../components/header/header";
import StartGameForm from "../../components/startGameForm/startGameForm";

const { Header, Sider, Content } = Layout;

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
  const [startGameModalOpen, setStartGameModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const victors = useRef(0);
  const winners = selectWinners();
  const [nameForm] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameState) {
      return;
    }

    if (!gameState.gameStarted) {
      setStartGameModalOpen(true);
    } else {
      setStartGameModalOpen(false);
    }
  }, [gameState?.gameStarted]);

  useEffect(() => {
    socket.on(SocketEvents.RestartGame, () => {
      setIsVictoryModalOpen(false);
      setIsDefeatModalOpen(false);
      victors.current = 0;
      dispatch(winnerStateActions.clearWinners());
    });
  }, []);

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
    socket.on(
      SocketEvents.GameStarted,
      () => {
        setStartGameModalOpen(false);
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
    <Layout style={{ height: "100%", minHeight: "35em" }}>
      <Sider width={"3em"}>
        <MyHeader roomName={roomModel.roomName} />
      </Sider>
      <Content style={content}>
        <Flex vertical style={{ height: "100%" }}>
          <Flex style={{ height: "100%" }}>
            <Flex
              flex={1}
              vertical
              justify="space-between"
              style={{ height: "100%" }}
            >
              {gameState?.gameStarted && playerState?.hand && (
                <>
                  <Flex style={section} justify="space-evenly" flex={1}>
                    {playerState.otherPlayers.map((player, index) => (
                      <OpponentDeck player={player} key={index} />
                    ))}
                  </Flex>

                  <Flex justify="center" style={section} flex={1}>
                    <PlayArea style={{}} />
                  </Flex>
                  <Flex justify="center" style={section} flex={2}>
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
                Shame and dishonour on your family! You have lost against the
                might of your opponent.
              </Modal>

              <Modal
                title={`Room: ${roomModel?.roomName}`}
                open={startGameModalOpen}
                onOk={() => {
                  socket.emit(SocketEvents.MarkReady, {
                    roomName: roomModel!.roomName,
                    playerId: playerState!.me.playerId,
                    ready: playerState.me.ready ? false : true,
                  });
                }}
                okText={playerState?.me?.ready ? "Unready" : "Ready"}
                footer={null}
              >
                <StartGameForm />
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
                    rules={[
                      { required: true, message: "Please enter a name." },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>
            </Flex>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
};

const content: React.CSSProperties = {
  backgroundImage: "url('/images/green-felt.jpg')",
  backgroundSize: "cover",
  color: "#EEE",
  textShadow: "1px 1px 1px #000",
};

const section: React.CSSProperties = {
  flex: 1,
  width: "100%",
};

export default GameRoom;

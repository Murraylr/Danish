/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import ChatBox from "../../components/chatBox/chatBox";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import { selectRoomModel } from "../../redux/combineSelectors";
import { selectPlayerState } from "../../redux/playerState/playerStateSlice";
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
import OpponentDeck from "../../components/opponentDeck/opponentDeck";
import { GameState } from "../../models/gameState";
import { PlayerState } from "../../models/playerUpdate";
import { JoinRoomModel } from "../../models/joinRoomModel";
import { ChatMessage } from "../../models/chatMessage";
import DeveloperForm from "../../components/developerForm/developerForm";
import {
  selectWinners,
  winnerStateActions,
} from "../../redux/winnerStateSlice/winnerStateSlice";
import { CannotPlayCard } from "../../models/cannotPlayCardModel";
import PlayArea from "../../components/playArea/playArea";
import { useDispatch } from "react-redux";
import MyHeader from "../../components/header/header";
import StartGameForm from "../../components/startGameForm/startGameForm";
import { selectRoom } from "../../redux/roomState/roomStateSlice";
import { Turn } from "../../models/turn";
import { CardType } from "../../models/card";
import { GameHistory } from "../../services/gameHistory/gameHistory";
import { GameHistoryLoader } from "../../models/gameHistoryLoader";

const { Sider, Content } = Layout;

interface GameRoomProps {}

export interface HistoryGameParameters {
  jsonData: string;
  moveNumber: number;
}

const TestRoom: React.FC<GameRoomProps> = ({}) => {
  const gameState = selectGameState();
  const playerState = selectPlayerState();
  const [api, contextHolder] = notification.useNotification();
  const victors = useRef(0);
  const winners = selectWinners();
  const dispatch = useDispatch();
  const room = selectRoom();
  const [form] = Form.useForm();
  const [loadGameOpen, setLoadGameOpen] = useState(false);

  useEffect(() => {
    socket.emit(SocketEvents.JoinTestRoom);
  }, []);

  const nextMove = useCallback(() => {
    socket.emit(SocketEvents.playNextHistoryMove);
  }, []);

  const loadGame: FormProps<HistoryGameParameters>["onFinish"] = (
    values: HistoryGameParameters
  ) => {
    let history = JSON.parse(values.jsonData) as GameHistory;
    let gameHistoryLoader: GameHistoryLoader = {
      gameHistory: history,
      moveNumber: values.moveNumber - 1,
    };
    socket.emit(SocketEvents.loadTestGameFromHistory, gameHistoryLoader);
    setLoadGameOpen(false);
  };

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
  }, [winners, playerState]);

  const onPlayCards = useCallback((selectedCards: CardType[]) => {
    let turn: Turn = {
      cards: selectedCards,
      playerId: playerState.me.playerId,
      room: room,
    };
    socket.emit(SocketEvents.PlayCard, turn);
  }, []);

  return (
    <Layout style={{ height: "100%", minHeight: "35em" }}>
      <Sider width={"3em"}>
        <MyHeader roomName={room?.roomName} />
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
                    <Button onClick={nextMove}>Play next move</Button>
                    <MyCards
                      onPlayCards={onPlayCards}
                      cards={playerState.hand}
                    />
                  </Flex>
                </>
              )}
              <Button onClick={() => setLoadGameOpen(true)}>Load game</Button>
              {contextHolder}
            </Flex>
          </Flex>
        </Flex>
        <Modal open={loadGameOpen}>
          <Form form={form} layout="vertical" onFinish={loadGame}>
            <Form.Item label="History (JSON)" name="jsonData">
              <Input type="text" name="jsonData" />
            </Form.Item>
            <Form.Item label="Move number" name="moveNumber">
              <Input type="number" name="moveNumber" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Load data
              </Button>
            </Form.Item>
          </Form>
        </Modal>
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

export default TestRoom;

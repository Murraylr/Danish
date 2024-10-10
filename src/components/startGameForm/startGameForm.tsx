import { Avatar, Button, Flex, Form, List } from "antd";
import React, { useMemo } from "react";
import { selectRoom } from "../../redux/roomState/roomStateSlice";
import { UserOutlined, WarningOutlined } from "@ant-design/icons";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import { selectPlayerState } from "../../redux/playerState/playerStateSlice";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { every } from "lodash";

const StartGameForm: React.FC = () => {
  const room = selectRoom();
  const playerState = selectPlayerState();
  const [readySelected, setReadySelected] = React.useState(false);
  const players = useMemo(
    () => room?.players || [],
    [room?.players]
  );
  const allPlayersReady = useMemo(
    () => every(players.map((p) => p.ready)),
    [players]
  );
  const playerAmount = useMemo(
    () => players.filter((p) => p.ready).length,
    [players]
  );
  const [form] = Form.useForm();

  return (
    <Flex vertical>
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          if (!readySelected && !allPlayersReady) {
            setReadySelected(true);
          } else {
            socket.emit(SocketEvents.StartGame, room!.roomName);
          }
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={players}
          renderItem={(item, index) => {
            const shouldBeYellow = !item.ready && readySelected;
            const style: React.CSSProperties = {
              color: shouldBeYellow ? "#FAAD14" : "",
            };

            return (
              <List.Item id={item.playerId}>
                <List.Item.Meta
                  avatar={<Avatar size="large" icon={<UserOutlined />} />}
                  title={item.name}
                  description={
                    item.ready ? (
                      "Ready"
                    ) : (
                      <span style={style}>
                        {readySelected && <WarningOutlined />} Not ready
                      </span>
                    )
                  }
                />
                <Flex vertical justify="space-between">
                  {room?.myId === item.playerId && (
                    <Button
                      onClick={() => {
                        socket.emit(SocketEvents.MarkReady, {
                          roomName: room.roomName,
                          playerId: room.myId,
                          ready: playerState.me.ready ? false : true,
                        });
                      }}
                    >
                      {item.ready ? "Cancel" : "Ready"}
                    </Button>
                  )}
                </Flex>
              </List.Item>
            );
          }}
        />
        <Flex justify="flex-end" vertical>
          {readySelected && !allPlayersReady && (
            <div style={warningStyle}>
              <WarningOutlined /> Not all players are ready. Start without them?
            </div>
          )}
          <Form.Item>
            <Button
              disabled={playerAmount < 2}
              type="primary"
              htmlType="submit"
              title={
                playerAmount < 2 ? "At least 2 players needed to play" : ""
              }
            >
              Start Game
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
};

const warningStyle: React.CSSProperties = {
  color: "#FAAD14",
};

export default StartGameForm;

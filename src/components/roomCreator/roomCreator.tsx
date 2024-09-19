import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionStorage } from "../../services/sessionStorage/sessionStorage";
import { Button, Form, Input, Layout } from "antd";
import type { FormProps } from "antd";
import { JoinRoomModel } from "../../models/joinRoomModel";

const { Header, Footer, Sider, Content } = Layout;

interface RoomCreatorProps {
  // Add any props you need here
  navigator: any;
}

type RoomCreatorFields = {
  roomName: string;
  playerName: string;
};

const RoomCreator: React.FC<RoomCreatorProps> = ({}: RoomCreatorProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleJoinRoom: FormProps<RoomCreatorFields>["onFinish"] = (
    values: RoomCreatorFields
  ) => {
    SessionStorage.SetPlayerName(values.playerName);
    navigate(`Room/${values.roomName}`);
  };

  return (
    <Layout>
      <Header style={headerStyle}>Danish Card Game</Header>
      <Content style={contentStyle}>
        <h2>Create or Join a Game Room</h2>
        <Form style={formStyle} form={form} layout="horizontal" onFinish={handleJoinRoom}>
          <Form.Item
            label="Room Name"
            name="roomName"
            rules={[{ required: true, message: "Please enter a room name." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Player Name"
            name="playerName"
            rules={[{ required: true, message: "Please enter your name." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item >
            <Button type="primary" htmlType="submit">
              Create/Join Room
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',

}

const formStyle: React.CSSProperties = {
  width: '40em',
  margin: 'auto',
  textAlign: 'center',
}

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "8em",
  minHeight: 120,
};

export default RoomCreator;

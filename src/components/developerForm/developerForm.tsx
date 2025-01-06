import { Button, Form, FormProps, Input } from "antd";
import React, { useState } from "react";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { TestParameters } from "../../models/testParameters";
import { selectRoom } from "../../redux/roomState/roomStateSlice";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Set card amounts",
    children: (
      <>
        <Form.Item label="Number of Players" name="numPlayers">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Number in deck" name="deckAmount">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Number in hand" name="handAmount">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Number in best" name="bestAmount">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Number in blind" name="blindAmount">
          <Input type="number" />
        </Form.Item>
      </>
    ),
  },
  {
    key: "2",
    label: "Load from history",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab Pane 3",
  },
];

const DeveloperForm: React.FC = () => {
  const [form] = Form.useForm();
  const room = selectRoom();
  const [tab, setTab] = useState("1");

  const handleJoinRoom: FormProps<TestParameters>["onFinish"] = (
    values: TestParameters
  ) => {
    socket.emit(SocketEvents.SetTest, { ...values, roomName: room.roomName });
  };

  const onChange = (key: string) => {
    setTab(key);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleJoinRoom}>
      <Tabs activeKey={tab} items={items} onChange={onChange} />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Set Test
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DeveloperForm;

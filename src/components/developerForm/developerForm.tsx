import { Button, Form, FormProps, Input } from "antd";
import React, { useState } from "react";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { TestParameters } from "../../models/testParameters";
import { selectRoom } from "../../redux/roomState/roomStateSlice";

const DeveloperForm: React.FC = () => {
  const [form] = Form.useForm();
  const room = selectRoom();

  const handleJoinRoom: FormProps<TestParameters>["onFinish"] = (
    values: TestParameters
  ) => {
    socket.emit(SocketEvents.SetTest, { ...values, roomName: room.roomName });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleJoinRoom}>
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Set Test
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DeveloperForm;

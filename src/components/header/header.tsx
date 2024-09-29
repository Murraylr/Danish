import { Button, Flex, Layout, Menu, MenuProps, Modal } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExperimentOutlined,
  ReloadOutlined,
  ExportOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import DeveloperForm from "../developerForm/developerForm";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { useNavigate, useNavigation } from "react-router-dom";

const { Header } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

interface HeaderProps {
  roomName: string;
}

const MyHeader: React.FC<HeaderProps> = ({ roomName }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [developerForm, setDeveloperForm] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed((c) => !c);
  };

  const fullMenuItems: MenuItem[] = useMemo(() => {
    return [
      {
        label: "",
        key: "Expand",
        icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
        onClick: toggleCollapsed,
        style: itemStyle,
      },
      {
        label: "Game Rules",
        key: "rules",
        icon: <QuestionCircleOutlined />,
        style: itemStyle,
      },
      {
        label: "Restart",
        key: "restart",
        icon: <ReloadOutlined />,
        style: itemStyle,
        onClick: () => socket.emit(SocketEvents.RestartGame, roomName),
      },
      {
        label: "Leave Room",
        key: "leaveRoom",
        icon: <ExportOutlined />,
        style: itemStyle,
        onClick: () => {
          socket.emit(SocketEvents.LeaveRoom, roomName);
          navigate('/');
        },
      },
      {
        label: "Setup Test",
        key: "setTest",
        icon: <ExperimentOutlined />,
        style: itemStyle,
        onClick: () => setDeveloperForm(true),
      },
    ];
  }, [collapsed]);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    //setCurrent(e.key);
  };

  const style = useMemo(() => {
    return {
      ...headerStyle,
      width: collapsed ? "50px" : "150px",
    };
  }, [collapsed]);

  return (
    <>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        selectedKeys={[]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={fullMenuItems}
        style={style}
      ></Menu>
      <Modal
        open={developerForm}
        onCancel={() => {
          setDeveloperForm(false);
        }}
        footer={null}
      >
        <DeveloperForm />
      </Modal>
    </>
  );
};

const headerStyle: React.CSSProperties = {
  height: "100%",
  paddingLeft: "0px",
  position: "relative",
};

const itemStyle: React.CSSProperties = {
  paddingLeft: "1em",
};

export default MyHeader;

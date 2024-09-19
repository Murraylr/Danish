import React, { useCallback, useEffect } from "react";
import "./App.css";
import { startSocketIO } from "./services/socket.io/socket.io";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/homePage/homePage";
import GameRoom from "./pages/room/gameRoom";
import { Provider } from "react-redux";
import store from "./redux/reduxStore";
import { ConfigProvider } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/room/:roomName",
    element: <GameRoom />,
  },
]);

function App() {
  useEffect(() => {
    startSocketIO(store);
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              footerBg: '#eee',
            },
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
}

export default App;

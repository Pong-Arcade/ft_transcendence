import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import ChatRoom from "./pages/ChatRoom";
import GameRoom from "./pages/GameRoom";
import Lobby from "./pages/Lobby";
import Login from "./pages/Login";
import Ranking from "./pages/Ranking";
import Root from "./pages/Root";
import Stat from "./pages/Stat";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";

import ChatSocket from "./utils/ChatSocket";

const socket: ChatSocket = new ChatSocket(
  Math.floor(Math.random() * 1000),
  "user" + Math.floor(Math.random() * 1000)
);
console.log(socket.socket);
console.log(socket.username);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,

    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "lobby",
        element: <Lobby socket={socket} />,
      },
      {
        path: "game-rooms/:gameId",
        element: <GameRoom />,
      },
      {
        path: "chat-rooms/:chatId",
        element: <ChatRoom />,
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
      {
        path: "stat/:userId",
        element: <Stat />,
      },
      {
        path: "*",
        element: <Navigate to={"/"} />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </ThemeProvider>
  // </React.StrictMode>
);

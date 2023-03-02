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
import Login2FA from "./pages/Login2FA";
import Ranking from "./pages/Ranking";
import Root from "./pages/Root";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";

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
        path: "2FA",
        element: <Login2FA />,
      },
      {
        path: "lobby",
        element: <Lobby />,
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
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>
);

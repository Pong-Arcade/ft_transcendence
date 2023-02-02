import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Chat from "./pages/Chat/index";
import Game from "./pages/Game/index";
import Lobby from "./pages/Lobby/index";
import Login from "./pages/Login/index";
import Root from "./pages/Root";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";

// TODO: refactoring
// TODO: input box
// TODO: scrollbar design
// TODO: input size

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />,
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
        path: "game/:gameId",
        element: <Game />,
      },
      {
        path: "chat/:chatId",
        element: <Chat />,
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

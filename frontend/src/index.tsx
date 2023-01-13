import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Chat from "./pages/Chat";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";
import Login from "./pages/Login";
import Root from "./pages/Root";

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
    <RouterProvider router={router} />
  </React.StrictMode>
);

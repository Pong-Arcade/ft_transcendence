import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  IGameRoom,
  ILobbyGameRoom,
} from "../../components/modules/Pagination/Pagination";
import errorState from "../../state/ErrorState";
import gameRoomListState from "../../state/GameRoomListState";
import gameRoomState from "../../state/GameRoomState";
import GameSocket from "../../state/GameSocket";
import infoState from "../../state/InfoState";
import { SocketContext } from "../../utils/ChatSocket";

const lobbyGameEvent = () => {
  const gameSocket = useContext(GameSocket);
  const chatSocket = useContext(SocketContext);
  const myInfo = useRecoilValue(infoState);
  const setGameRoomList = useSetRecoilState(gameRoomListState);
  const setGameRoomState = useSetRecoilState(gameRoomState);
  const setError = useSetRecoilState(errorState);
  const navigate = useNavigate();

  useEffect(() => {
    chatSocket.socket.on("addGameRoom", (addRoom: ILobbyGameRoom) => {
      setGameRoomList((prev) => [...prev, addRoom]);
    });
    chatSocket.socket.on("deleteGameRoom", (roomId: number) => {
      setGameRoomList((prev) => prev.filter((room) => room.roomId !== roomId));
    });

    chatSocket.socket.on("joinGameRoom", ({ joinUser, roomId }) => {
      setGameRoomList((prev) => {
        const newGameRoomList: ILobbyGameRoom[] = [];
        for (const room of prev) {
          if (
            room.roomId === roomId &&
            room.redUser.userId !== joinUser.userId
          ) {
            const newRoom = { ...room };
            newRoom.blueUser = {
              nickname: joinUser.nickname,
              userId: joinUser.userId,
              avatarUrl: joinUser.avatarUrl,
            };
            newGameRoomList.push(newRoom);
          } else newGameRoomList.push(room);
        }
        return newGameRoomList;
      });
    });
    gameSocket.socket.on("gameRoomMatched", (gameRoom: IGameRoom) => {
      setGameRoomState(gameRoom);
      navigate(`/game-rooms/${gameRoom.roomId}}`);
    });

    gameSocket.socket.on("connect_unauth_error", (err) => {
      setError({ isError: true, error: { response: { status: 401 } } });
    });
    chatSocket.socket.on("connect_unauth_error", (err) => {
      setError({ isError: true, error: { response: { status: 401 } } });
    });

    return () => {
      chatSocket.socket.off("addGameRoom");
      chatSocket.socket.off("deleteGameRoom");
      chatSocket.socket.off("joinGameRoom");
      gameSocket.socket.off("gameRoomMatched");
      gameSocket.socket.off("connect_unauth_error");
      chatSocket.socket.off("connect_unauth_error");
    };
  }, []);

  useEffect(() => {
    if (gameSocket.userId === -1 && myInfo.userId !== -1) {
      gameSocket.userId = myInfo.userId;
      gameSocket.userName = myInfo.nickname;
      gameSocket.socket.emit("addUser", {
        userId: myInfo.userId,
        userName: myInfo.nickname,
      });
    }
  }, [myInfo]);
};

export default lobbyGameEvent;

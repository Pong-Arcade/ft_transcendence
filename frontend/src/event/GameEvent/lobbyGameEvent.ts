import { useContext, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ILobbyGameRoom } from "../../components/modules/Pagination/Pagination";
import gameRoomListState from "../../state/GameRoomListState";
import GameSocket from "../../state/GameSocket";
import infoState from "../../state/InfoState";
import { SocketContext } from "../../utils/ChatSocket";

const lobbyGameEvent = () => {
  const gameSocket = useContext(GameSocket);
  const chatSocket = useContext(SocketContext);
  const myInfo = useRecoilValue(infoState);
  const setGameRoomList = useSetRecoilState(gameRoomListState);

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

    return () => {
      chatSocket.socket.off("addGameRoom");
      chatSocket.socket.off("deleteGameRoom");
      chatSocket.socket.off("joinGameRoom");
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

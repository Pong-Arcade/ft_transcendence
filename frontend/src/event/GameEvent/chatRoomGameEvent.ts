import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  IGameRoom,
  IUser,
} from "../../components/modules/Pagination/Pagination";
import gameRoomState from "../../state/GameRoomState";
import GameSocket from "../../state/GameSocket";

interface IChatRoomGameEvent {
  onInviteGameModalOpen: () => void;
  onInviteRejectModalOpen: () => void;
}

const chatRoomGameEvent = ({
  onInviteGameModalOpen,
  onInviteRejectModalOpen,
}: IChatRoomGameEvent) => {
  const { socket } = useContext(GameSocket);
  const [inviteUser, setInviteUser] = useState<IUser>({});
  const setGameRoomState = useSetRecoilState(gameRoomState);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("inviteGameRoom", (user: IUser) => {
      setInviteUser(user);
      onInviteGameModalOpen();
    });

    socket.on("gameRoomMatched", (gameRoom: IGameRoom) => {
      setGameRoomState(gameRoom);
      navigate(`/game-rooms/${gameRoom.roomId}`);
    });

    socket.on("rejectInviteGameRoom", () => {
      onInviteRejectModalOpen();
    });

    return () => {
      socket.off("inviteGameRoom");
      socket.off("gameRoomMatched");
      socket.off("rejectInviteGameRoom");
    };
  }, []);
  return { inviteUser };
};

export default chatRoomGameEvent;

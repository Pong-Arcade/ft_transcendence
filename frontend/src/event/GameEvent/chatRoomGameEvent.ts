import { useContext, useEffect, useState } from "react";
import {
  IGameRoom,
  IUser,
} from "../../components/modules/Pagination/Pagination";
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

  useEffect(() => {
    socket.on("inviteGameRoom", (user: IUser) => {
      setInviteUser(user);
      onInviteGameModalOpen();
    });

    socket.on("gameRoomMatched", (gameRoom: IGameRoom) => {
      console.log(gameRoom);
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

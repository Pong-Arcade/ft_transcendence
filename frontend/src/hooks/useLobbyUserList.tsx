import { useRecoilValue } from "recoil";
import { blockUsersState } from "../state/BlockUsersState";
import { friendUsersState } from "../state/FriendUsersState";
import { onlineUsersState } from "../state/OnlineUsersState";

const useLobbyUserList = () => {
  const onlineUsers = useRecoilValue(onlineUsersState);
  const friendUsers = useRecoilValue(friendUsersState);
  const blockUsers = useRecoilValue(blockUsersState);

  return {
    onlineUsers,
    friendUsers,
    blockUsers,
  };
};

export default useLobbyUserList;

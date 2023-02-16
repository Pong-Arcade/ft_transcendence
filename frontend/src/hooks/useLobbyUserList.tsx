import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
} from "../api/users";
import { blockUsersState } from "../state/BlockUsersState";
import { friendUsersState } from "../state/FriendUsersState";
import { onlineUsersState } from "../state/OnlineUsersState";

const useLobbyUserList = () => {
  const [onlineUsers, setOnlineUsers] = useRecoilState(onlineUsersState);
  const [friendUsers, setFriendUsers] = useRecoilState(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState(blockUsersState);
  useEffect(() => {
    const getOnlineUsers = async () => {
      const data = await getOnlineUsersAPI();
      setOnlineUsers(data);
    };
    const getFriendUsers = async () => {
      const data = await getFriendUsersAPI();
      setFriendUsers(data);
    };
    const getBlockUsers = async () => {
      const data = await getBlockUsersAPI();
      setBlockUsers(data);
    };
    getOnlineUsers();
    getFriendUsers();
    getBlockUsers();
  }, []);

  return {
    onlineUsers,
    friendUsers,
    blockUsers,
    setOnlineUsers,
    setFriendUsers,
    setBlockUsers,
  };
};

export default useLobbyUserList;

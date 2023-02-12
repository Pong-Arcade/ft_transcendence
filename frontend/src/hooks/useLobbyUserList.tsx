import { useEffect, useState } from "react";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
} from "../api/users";
import { IItem } from "../components/modules/LobbyUserItem/LobbyUserItem";

const useLobbyUserList = () => {
  const [onlineUsers, setOnlineUsers] = useState<IItem[]>([]);
  const [friendUsers, setFriendUsers] = useState<IItem[]>([]);
  const [blockUsers, setBlockUsers] = useState<IItem[]>([]);
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

  return { onlineUsers, friendUsers, blockUsers };
};

export default useLobbyUserList;

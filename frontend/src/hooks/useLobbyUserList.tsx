import { useEffect, useState } from "react";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
} from "../api/users";
import { IUser } from "../components/modules/Pagination/Pagination";

const useLobbyUserList = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] = useState<IUser[]>([]);
  const [blockUsers, setBlockUsers] = useState<IUser[]>([]);

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

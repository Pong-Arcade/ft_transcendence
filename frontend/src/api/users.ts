import { getRequest } from "./axios";

export const getOnlineUsersAPI = async () => {
  const response = await getRequest("users");
  return response.data.onlineUsers;
};

export const getFriendUsersAPI = async () => {
  const response = await getRequest("friends");
  return response.data.friendUsers;
};
export const getBlockUsersAPI = async () => {
  const response = await getRequest("block");
  return response.data.blockUsers;
};

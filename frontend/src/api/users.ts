import { deleteRequest, getRequest, patchRequest } from "./axios";

// TODO: 실패 처리
export const getOnlineUsersAPI = async () => {
  const response = await getRequest("users");
  return response.data.onlineUsers;
};

export const getFriendUsersAPI = async () => {
  const response = await getRequest("friends");
  return response.data.friendUsers;
};

export const patchFriendUsersAPI = async (userId: number) => {
  const response = await patchRequest(`friends/${userId}`);
  return response;
};

export const deleteFriendUsersAPI = async (userId: number) => {
  const response = await deleteRequest(`friends/${userId}`);
  return response;
};

export const getBlockUsersAPI = async () => {
  const response = await getRequest("block");
  return response.data.blockUsers;
};

export const patchBlockUsersAPI = async (userId: number) => {
  const response = await patchRequest(`block/${userId}`);
  return response;
};

export const deleteBlockUsersAPI = async (userId: number) => {
  const response = await deleteRequest(`block/${userId}`);
  return response;
};

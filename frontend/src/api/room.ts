import { ILobbyChatRoomFormValues } from "../hooks/useChatRoomForm";
import { EGameType, IGameRoomFormValues } from "../hooks/useGameRoomForm";
import { deleteRequest, getRequest, patchRequest, postRequest } from "./axios";

export const getChatRoomListAPI = async () => {
  const response = await getRequest("chat-rooms");
  return response.data.chatRooms;
};

export const createChatRoomAPI = async (values: ILobbyChatRoomFormValues) => {
  const response = await postRequest("chat-rooms/create", {
    ...values,
    maxUserCount: +values.maxUserCount,
  });
  return response;
};

export const joinChatRoomAPI = async (roomId: number, password?: string) => {
  const response = await postRequest(`chat-rooms/join/${roomId}`, { password });
  return response;
};

export const leaveChatRoomAPI = async (roomId: number) => {
  const response = await deleteRequest(`chat-rooms/leave/${roomId}`);
  return response;
};

export const banChatRoomAPI = async (roomId: number, userId: number) => {
  const response = await deleteRequest(`chat-rooms/ban/${roomId}/${userId}`);
  return response;
};

export const changeChatRoomInfoAPI = async (
  roomId: number,
  values: ILobbyChatRoomFormValues
) => {
  const response = await patchRequest(
    `chat-rooms/change-info/${roomId}`,
    values
  );
  return response;
};

export const promoteAdminAPI = async (roomId: number, userId: number) => {
  const response = await patchRequest(
    `chat-rooms/promote-admin/${roomId}/${userId}`
  );
  return response;
};

export const demoteAdminAPI = async (roomId: number, userId: number) => {
  const response = await patchRequest(
    `chat-rooms/demote-admin/${roomId}/${userId}`
  );
  return response;
};

export const muteChatRoomAPI = async (roomId: number, userId: number) => {
  const response = await patchRequest(
    `chat-rooms/mute/${roomId}/${userId}/100`
  );
  return response;
};

export const getGameRoomListAPI = async () => {
  const response = await getRequest("game-rooms");
  return response.data.gameRooms;
};

export const createGameRoomAPI = async (
  type: EGameType,
  values: IGameRoomFormValues
) => {
  const response = await postRequest("game-rooms/create", {
    ...values,
    maxSpectatorCount: +values.maxSpectatorCount,
    winScore: +values.winScore,
    type: type,
  });
  return response.data;
};

export const joinGamePlayerAPI = async (roomId: number) => {
  const response = await postRequest(`game-rooms/join/${roomId}`);
  return response;
};

export const joinGameSpectatorAPI = async (roomId: number) => {
  const response = await postRequest(`game-rooms/spectator/join/${roomId}`);
  return response;
};

export const leaveGameRoomAPI = async (roomId: number) => {
  const response = await deleteRequest(`game-rooms/leave/${roomId}`);
  return response;
};

export const readyGameRoomAPI = async (roomId: number) => {
  const response = await patchRequest(`game-rooms/ready/${roomId}`);
  return response;
};

export const unReadyGameRoomAPI = async (roomId: number) => {
  const response = await patchRequest(`game-rooms/unready/${roomId}`);
  return response;
};

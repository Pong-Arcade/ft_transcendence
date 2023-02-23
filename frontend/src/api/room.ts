import { ILobbyChatRoomFormValues } from "../hooks/useChatRoomForm";
import { EGameType, IGameRoomFormValues } from "../hooks/useGameRoomForm";
import { deleteRequest, getRequest, postRequest } from "./axios";

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

export const leaveChatRoomAPI = async (roomId: number) => {
  const response = await deleteRequest(`chat-rooms/leave/${roomId}`);
  console.log("response: ", response);
  return response;
};
export const joinChatRoomAPI = async (roomId: string) => {
  console.log(`chat-rooms/join/${roomId}`);
  const response = await postRequest(`chat-rooms/join/${roomId}`);
  console.log("response:", response);
  return response;
};

export const createGameRoomAPI = async (
  mode: EGameType,
  values: IGameRoomFormValues
) => {
  const response = await postRequest("game-rooms/create", {
    ...values,
    maxSpectatorCount: +values.maxSpectatorCount,
    winScore: +values.winScore,
    type: mode,
  });
  return response;
};

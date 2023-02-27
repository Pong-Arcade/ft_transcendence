import {
  IChatRoomInviteForm,
  ILobbyChatRoomFormValues,
} from "../hooks/useChatRoomForm";
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

export const joinChatRoomAPI = async (roomId: string) => {
  console.log(`chat-rooms/join/${roomId}`);
  const response = await postRequest(`chat-rooms/join/${roomId}`);
  console.log("response:", response);
  return response;
};

export const leaveChatRoomAPI = async (roomId: number) => {
  const response = await deleteRequest(`chat-rooms/leave/${roomId}`);
  console.log("response: ", response);
  return response;
};

export const banChatRoomAPI = async (roomId: number, userId: number) => {
  const response = await deleteRequest(`chat-rooms/ban/${roomId}/${userId}`);
  console.log("response: ", response);
  return response;
};

export const promoteAdminAPI = async (roomId: number, userId: number) => {
  const response = await patchRequest(
    `chat-rooms/promote-admin/${roomId}/${userId}`
  );
  console.log("response: ", response);
  return response;
};

export const demoteAdminAPI = async (roomId: number, userId: number) => {
  const response = await patchRequest(
    `chat-rooms/demote-admin/${roomId}/${userId}`
  );
  console.log("response: ", response);
  return response;
};

export const muteChatRoomAPI = async (roomId: number, userId: number) => {
  const response = await patchRequest(
    `chat-rooms/mute/${roomId}/${userId}/100`
  );
  console.log("response: ", response);
  return response;
};

export const inviteChatRoomAPI = async (roomId: number, userId: string[]) => {
  const userForm = { users: new Array<number>() };
  for (const id of userId) userForm.users.push(Number(id));
  const response = await postRequest(`chat-rooms/invite/${roomId}`, userForm);
  console.log("response: ", response);
  return response;
};

export const acceptInviteChatRoomAPI = async (roomId: number) => {
  const response = await postRequest(`chat-rooms/invite/${roomId}`);
  return response;
};

export const rejectInviteChatRoomAPI = async (roomId: number) => {
  const response = await deleteRequest(`chat-rooms/reject/${roomId}`);
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

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

export const updateChatRoomAPI = async (
  roomId: number,
  title: string,
  mode: string,
  password?: string
) => {
  const response = await patchRequest(`chat-rooms/change-info/${roomId}`, {
    title: title,
    mode: mode,
    password: password,
  });
  return response;
};

export const banChatRoomAPI = async (roomId: number, userId: number) => {
  const response = await deleteRequest(`chat-rooms/ban/${roomId}/${userId}`);
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

export const unmuteChatRoomAPI = async (roomId: number, userId: number) => {
  const response = await patchRequest(
    `chat-rooms/unmute/${roomId}/${userId}`
  );
  return response;
};

export const inviteChatRoomAPI = async (roomId: number, userId: string[]) => {
  const userForm = { users: new Array<number>() };
  for (const id of userId) userForm.users.push(Number(id));
  const response = await postRequest(`chat-rooms/invite/${roomId}`, userForm);
  return response;
};

export const acceptInviteChatRoomAPI = async (roomId: number) => {
  const response = await postRequest(`chat-rooms/invite/accept/${roomId}`);
  return response;
};

export const rejectInviteChatRoomAPI = async (roomId: number) => {
  const response = await deleteRequest(`chat-rooms/invite/reject/${roomId}`);
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

export const leaveGameSpectatorAPI = async (roomId: number) => {
  const response = await deleteRequest(`game-rooms/spectate/leave/${roomId}`);
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

export const inviteGameAPI = async (userId: number) => {
  const response = await postRequest(`game-rooms/invite/${userId}`);
  return response;
};

export const acceptGameAPI = async () => {
  const response = await postRequest(`game-rooms/invite/accept`);
  return response;
};

export const rejectGameAPI = async () => {
  const response = await deleteRequest(`game-rooms/invite/reject`);
  return response;
};
export const joinQuickMatchAPI = async (matcheType: EGameType) => {
  const response = await postRequest(
    `game-rooms/join/quick-match/${matcheType}`
  );
  return response;
};

export const leaveQuickMatchAPI = async () => {
  const response = await deleteRequest("game-rooms/leave/quick-match");
  return response;
};

export const getGameBoardConfigAPI = async () => {
  const response = await getRequest("game-rooms/config");
  return response.data;
};

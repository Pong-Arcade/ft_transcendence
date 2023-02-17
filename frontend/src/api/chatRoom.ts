import { IChatRoomFormValues } from "../hooks/useChatRoomForm";
import { getRequest, postRequest } from "./axios";

export const getChatRoomListAPI = async () => {
  const response = await getRequest("chat-rooms");
  return response.data.chatRooms;
};

export const createChatRoomAPI = async (values: IChatRoomFormValues) => {
  const response = await postRequest("chat-rooms/create", {
    ...values,
    maxUserCount: +values.maxUserCount,
  });
  return response;
};

import { deleteRequest, getRequest, patchRequest, postRequest } from "./axios";

export const getOnlineUsersAPI = async () => {
  const response = await getRequest("users");
  return response.data.onlineUsers;
};

export const getUserInfoAPI = async (userId: number) => {
  const response = await getRequest(`users/${userId}`);
  return response.data;
};

export const checkLocationAPI = async (userId: number, location: string) => {
  console.log("1", location.split("/")[1]);
  console.log("2", location.split("/")[2]);
  let response = await postRequest(
    `users/check/${userId}/${location.split("/")[1]}`,
    { roomId: location.split("/")[2] }
  );
  console.log("response: ", response);
  if (response.data.method == "post") {
    response = await postRequest(response.data.url);
    console.log(response);
    return response;
  } else if (response.data.method == "delete") {
    await deleteRequest(response.data.url);
    if (response.data.method2 == "post") {
      response = await postRequest(response.data.url2);
      console.log(response);
    }
    return response;
  }
};

export const updateUserInfoAPI = async (
  nickname: string,
  avatarImage?: File
) => {
  if (avatarImage) {
    const formData = new FormData();
    formData.append("avatarImage", avatarImage);
    formData.append("nickname", nickname);

    const response = await postRequest("users/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } else {
    const response = await postRequest("users/update", {
      nickname,
    });
    return response;
  }
};

export const getFriendUsersAPI = async () => {
  const response = await getRequest("friends");
  return response.data.friendUsers;
};

export const createFriendUsersAPI = async (userId: number) => {
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

export const createBlockUsersAPI = async (userId: number) => {
  const response = await patchRequest(`block/${userId}`);
  return response;
};

export const deleteBlockUsersAPI = async (userId: number) => {
  const response = await deleteRequest(`block/${userId}`);
  return response;
};

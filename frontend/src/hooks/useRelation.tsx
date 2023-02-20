import { useSetRecoilState } from "recoil";
import {
  deleteBlockUsersAPI,
  deleteFriendUsersAPI,
  getBlockUsersAPI,
  getFriendUsersAPI,
  createBlockUsersAPI,
  createFriendUsersAPI,
} from "../api/users";
import blockUsersState from "../state/BlockUsersState";
import friendUsersState from "../state/FriendUsersState";

const useRelation = (userId: number) => {
  const setFriendUsers = useSetRecoilState(friendUsersState);
  const setBlockUsers = useSetRecoilState(blockUsersState);

  const onAddFriend = async () => {
    const response = await createFriendUsersAPI(userId);
    if (response.status === 201) {
      const newFriendUsers = await getFriendUsersAPI();
      setFriendUsers(newFriendUsers);
    }
  };
  const onDelFriend = async () => {
    const response = await deleteFriendUsersAPI(userId);
    if (response.status === 204) {
      const newFriendUsers = await getFriendUsersAPI();
      setFriendUsers(newFriendUsers);
    }
  };
  const onAddBlock = async () => {
    const response = await createBlockUsersAPI(userId);
    if (response.status === 201) {
      const newBlockUsers = await getBlockUsersAPI();
      setBlockUsers(newBlockUsers);
    }
  };
  const onDelBlock = async () => {
    const response = await deleteBlockUsersAPI(userId);
    if (response.status === 204) {
      const newBlockUsers = await getBlockUsersAPI();
      setBlockUsers(newBlockUsers);
    }
  };
  return {
    onAddFriend,
    onDelFriend,
    onAddBlock,
    onDelBlock,
  };
};

export default useRelation;

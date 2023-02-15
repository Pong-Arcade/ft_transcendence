import { useRecoilState } from "recoil";
import {
  deleteBlockUsersAPI,
  deleteFriendUsersAPI,
  getBlockUsersAPI,
  getFriendUsersAPI,
  patchBlockUsersAPI,
  patchFriendUsersAPI,
} from "../api/users";
import { blockUsersState } from "../state/BlockUsersState";
import { friendUsersState } from "../state/FriendUsersState";

const useGeneralMenu = (userId: number) => {
  const [friendUsers, setFriendUsers] = useRecoilState(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState(blockUsersState);

  const onAddFriend = async () => {
    const response = await patchFriendUsersAPI(userId);
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
    const response = await patchBlockUsersAPI(userId);
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
    friendUsers,
    blockUsers,
    onAddFriend,
    onDelFriend,
    onAddBlock,
    onDelBlock,
  };
};

export default useGeneralMenu;

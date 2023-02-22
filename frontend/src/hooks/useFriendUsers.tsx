import { useSetRecoilState } from "recoil";
import {
  createFriendUsersAPI,
  deleteFriendUsersAPI,
  getFriendUsersAPI,
} from "../api/users";
import friendUsersState from "../state/FriendUsersState";

const useFriendUsers = (userId: number) => {
  const setFriendUsers = useSetRecoilState(friendUsersState);
  const onAddFriend = async () => {
    const response = await createFriendUsersAPI(userId);

    if (response.status === 200) {
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
  return { onAddFriend, onDelFriend };
};

export default useFriendUsers;

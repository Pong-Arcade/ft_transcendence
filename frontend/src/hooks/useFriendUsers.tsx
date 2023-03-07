import { useSetRecoilState } from "recoil";
import {
  createFriendUsersAPI,
  deleteFriendUsersAPI,
  getFriendUsersAPI,
} from "../api/users";
import blockUsersState from "../state/BlockUsersState";
import errorState from "../state/ErrorState";
import friendUsersState from "../state/FriendUsersState";

const useFriendUsers = (userId: number) => {
  const setError = useSetRecoilState(errorState);
  const setFriendUsers = useSetRecoilState(friendUsersState);
  const setBlockUsers = useSetRecoilState(blockUsersState);

  const onAddFriend = async () => {
    try {
      const response = await createFriendUsersAPI(userId);

      if (response.status === 200) {
        const newFriendUsers = await getFriendUsersAPI();
        setBlockUsers((prev) => prev.filter((user) => user.userId !== userId));
        setFriendUsers(newFriendUsers);
      }
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  const onDelFriend = async () => {
    try {
      const response = await deleteFriendUsersAPI(userId);
      if (response.status === 204) {
        const newFriendUsers = await getFriendUsersAPI();
        setFriendUsers(newFriendUsers);
      }
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  return { onAddFriend, onDelFriend };
};

export default useFriendUsers;

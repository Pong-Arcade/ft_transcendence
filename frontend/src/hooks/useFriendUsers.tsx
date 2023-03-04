import { useSetRecoilState } from "recoil";
import {
  createFriendUsersAPI,
  deleteFriendUsersAPI,
  getFriendUsersAPI,
} from "../api/users";
import errorState from "../state/ErrorState";
import friendUsersState from "../state/FriendUsersState";

const useFriendUsers = (userId: number) => {
  const setError = useSetRecoilState(errorState);
  const setFriendUsers = useSetRecoilState(friendUsersState);

  const onAddFriend = async () => {
    try {
      const response = await createFriendUsersAPI(userId);

      if (response.status === 200) {
        const newFriendUsers = await getFriendUsersAPI();
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

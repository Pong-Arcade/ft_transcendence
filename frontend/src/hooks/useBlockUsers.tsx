import { useSetRecoilState } from "recoil";
import {
  createBlockUsersAPI,
  deleteBlockUsersAPI,
  getBlockUsersAPI,
} from "../api/users";
import blockUsersState from "../state/BlockUsersState";
import errorState from "../state/ErrorState";
import friendUsersState from "../state/FriendUsersState";

const useBlockUsers = (userId: number) => {
  const setBlockUsers = useSetRecoilState(blockUsersState);
  const setFriendUsers = useSetRecoilState(friendUsersState);
  const setError = useSetRecoilState(errorState);

  const onAddBlock = async () => {
    try {
      const response = await createBlockUsersAPI(userId);
      if (response.status === 200) {
        const newBlockUsers = await getBlockUsersAPI();
        setFriendUsers((prev) => prev.filter((user) => user.userId !== userId));
        setBlockUsers(newBlockUsers);
      }
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  const onDelBlock = async () => {
    try {
      const response = await deleteBlockUsersAPI(userId);
      if (response.status === 204) {
        const newBlockUsers = await getBlockUsersAPI();
        setBlockUsers(newBlockUsers);
      }
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  return {
    onAddBlock,
    onDelBlock,
  };
};

export default useBlockUsers;

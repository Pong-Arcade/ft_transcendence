import { useSetRecoilState } from "recoil";
import {
  createBlockUsersAPI,
  deleteBlockUsersAPI,
  getBlockUsersAPI,
} from "../api/users";
import blockUsersState from "../state/BlockUsersState";

const useBlockUsers = (userId: number) => {
  const setBlockUsers = useSetRecoilState(blockUsersState);
  const onAddBlock = async () => {
    const response = await createBlockUsersAPI(userId);
    if (response.status === 200) {
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
    onAddBlock,
    onDelBlock,
  };
};

export default useBlockUsers;

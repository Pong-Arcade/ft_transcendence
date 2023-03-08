import useBlockUsers from "./useBlockUsers";
import useFriendUsers from "./useFriendUsers";

const useRelation = (userId: number) => {
  const { onAddFriend, onDelFriend } = useFriendUsers(userId);
  const { onAddBlock, onDelBlock } = useBlockUsers(userId);

  return {
    onAddFriend,
    onDelFriend,
    onAddBlock,
    onDelBlock,
  };
};

export default useRelation;

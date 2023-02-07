import { useState } from "react";

const useCreateGameModal = () => {
  const [isOpenCreateGame, setIsOpenCreateGame] = useState(false);
  const onCreateGameClick = () => {
    setIsOpenCreateGame(true);
  };
  return {
    isOpenCreateGame,
    onCreateGameClick,
  };
};

export default useCreateGameModal;

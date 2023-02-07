import { useState } from "react";

const useQuickGameModal = () => {
  const [isOpenQuickGame, setIsOpenQuickGame] = useState(false);
  const onQuickStartClick = () => {
    setIsOpenQuickGame(true);
  };

  return { isOpenQuickGame, onQuickStartClick };
};

export default useQuickGameModal;

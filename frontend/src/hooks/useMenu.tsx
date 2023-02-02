import React, { useState } from "react";

interface IUseMenu {
  isOpenMenu: boolean;
  onOpenMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseMenu: () => void;
  positionX: number;
  positionY: number;
}

function useMenu(): IUseMenu {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  const onOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPositionX(e.clientX);
    setPositionY(e.clientY);
    setOpenMenu(true);
  };
  const onCloseMenu = () => {
    setOpenMenu(false);
  };

  return { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY };
}

export default useMenu;

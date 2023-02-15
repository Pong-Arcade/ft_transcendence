import React, { useState } from "react";

interface IUseMenu {
  isOpenMenu: boolean;
  onOpenMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseMenu: () => void;
  positionX: number;
  positionY: number;
  id: number;
}

function useMenu(): IUseMenu {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [id, setId] = useState(-1);

  const onOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPositionX(e.clientX);
    setPositionY(e.clientY);
    setId(+e.currentTarget.id);
    setOpenMenu(true);
  };
  const onCloseMenu = () => {
    setOpenMenu(false);
  };

  return { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY, id };
}

export default useMenu;

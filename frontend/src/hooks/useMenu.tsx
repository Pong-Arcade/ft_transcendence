import React, { useState } from "react";

interface IUseMenu {
  isOpenMenu: boolean;
  onOpenMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseMenu: () => void;
  positionX: number;
  positionY: number;
  id: number;
  name: string;
}

function useMenu(): IUseMenu {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [id, setId] = useState(-1);
  const [name, setName] = useState("");

  const onOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPositionX(e.clientX);
    setPositionY(e.clientY);
    setId(+e.currentTarget.id);
    setName(e.currentTarget.innerText);
    setOpenMenu(true);
  };
  const onCloseMenu = () => {
    setOpenMenu(false);
  };

  return {
    isOpenMenu,
    onOpenMenu,
    onCloseMenu,
    positionX,
    positionY,
    id,
    name,
  };
}

export default useMenu;

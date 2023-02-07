import React, { useState } from "react";

export enum ERoomCreateButtonName {
  CHATROOM = "채팅방만들기",
  NORMALGAME = "일반게임",
  LADDERGAME = "레더게임",
}

const useCreateRoom = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("");
  const roomCreateList = [
    ERoomCreateButtonName.CHATROOM,
    ERoomCreateButtonName.LADDERGAME,
    ERoomCreateButtonName.NORMALGAME,
  ];
  const onCreateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.textContent) return;
    setButtonTitle(e.currentTarget.textContent);
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(false);
  };

  return { isOpenModal, buttonTitle, roomCreateList, onCreateButton, onClose };
};

export default useCreateRoom;

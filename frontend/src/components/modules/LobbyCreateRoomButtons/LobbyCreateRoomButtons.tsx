import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ChooseGameModal from "../ChooseGameModal";
import ChatSocket from "../../../utils/ChatSocket";
import CreateChatRoomModal from "../CreateChatRoomModal";

enum ERoomCreateButtonName {
  CHATROOM = "채팅방만들기",
  NORMALGAME = "일반게임",
  LADDERGAME = "레더게임",
}

const CreateRoomButton = styled(Button).attrs({
  width: "25%",
  height: "70%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const LobbyCreateRoomButtons = () => {
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

  return (
    <>
      <ButtonGroup height="10%" width="100%" boxShadow>
        {roomCreateList.map((elem, idx) => (
          <CreateRoomButton key={idx} onClick={onCreateButton}>
            {elem}
          </CreateRoomButton>
        ))}
      </ButtonGroup>
      {isOpenModal && (
        <ModalWrapper onClose={onClose}>
          {buttonTitle === ERoomCreateButtonName.CHATROOM ? (
            <CreateChatRoomModal onClose={onClose} title="채팅방만들기" />
          ) : buttonTitle === ERoomCreateButtonName.LADDERGAME ? (
            <ChooseGameModal onClose={onClose} buttonTitle="레더게임" />
          ) : (
            <ChooseGameModal onClose={onClose} buttonTitle="일반게임" />
          )}
        </ModalWrapper>
      )}
    </>
  );
};

export default LobbyCreateRoomButtons;

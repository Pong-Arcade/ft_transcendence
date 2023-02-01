import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import ChooseGameModal from "../ChooseGameModal";
import CreateRoomModal from "../CreateRoomModal";
import ChatSocket from "../../../utils/ChatSocket";

export enum ERoomCreateButtonName {
  ChatRoom = "채팅방만들기",
  NormalGame = "일반게임",
  LadderGame = "레더게임",
}

const LobbyCreateRoomButtons = ({ socket }: { socket: ChatSocket }) => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [buttonType, setButtonType] = useState("");
  const navigate = useNavigate();
  const roomCreateList = [
    ERoomCreateButtonName.ChatRoom,
    ERoomCreateButtonName.LadderGame,
    ERoomCreateButtonName.NormalGame,
  ];
  const handleCreateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.textContent) return;
    setButtonType(e.currentTarget.textContent);
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(false);
  };
  const createdRoom = (msg: any) => {
    console.log("created ", msg);
    if (msg.code == 201) {
      navigate("/chat-rooms/" + msg.roomid);
    }
  };
  useEffect(() => {
    socket.socket.on("createdRoom", createdRoom);
  });
  const onSubmit = (values: any) => {
    values.creator = socket.userid;
    console.log("submit", values);
    socket.socket.emit("createRoom", { values });
    setOpenModal(false);
  };

  return (
    <>
      {isOpenModal && (
        <ModalWrapper onClose={onClose}>
          {buttonType === ERoomCreateButtonName.ChatRoom ? (
            <CreateRoomModal
              onClose={onClose}
              onSubmit={onSubmit}
              buttonType={buttonType}
            />
          ) : (
            <ChooseGameModal onClose={onClose} buttonType={buttonType} />
          )}
        </ModalWrapper>
      )}
      <ButtonGroup height="10%" width="100%" boxShadow>
        {roomCreateList.map((elem, idx) => (
          <Button
            key={idx}
            onClick={handleCreateButton}
            width="25%"
            height="70%"
            boxShadow
            fontSize="2rem"
          >
            {elem}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
};

export default LobbyCreateRoomButtons;

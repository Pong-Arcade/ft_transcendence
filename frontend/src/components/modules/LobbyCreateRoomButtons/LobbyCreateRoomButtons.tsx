import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useCreateRoom, {
  ERoomCreateButtonName,
} from "../../../hooks/useCreateRoom";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";
import ChooseGameModal from "../ChooseGameModal";
import ChatSocket from "../../../utils/ChatSocket";
import CreateChatRoomModal from "../CreateChatRoomModal";

const CreateRoomButton = styled(Button).attrs({
  width: "25%",
  height: "70%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const LobbyCreateRoomButtons = () => {
  const { isOpenModal, buttonTitle, roomCreateList, onCreateButton, onClose } =
    useCreateRoom();

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
        <>
          {buttonTitle === ERoomCreateButtonName.CHATROOM ? (
            <CreateChatRoomModal
              onClose={onClose}
              title={ERoomCreateButtonName.CHATROOM}
            />
          ) : buttonTitle === ERoomCreateButtonName.LADDERGAME ? (
            <ChooseGameModal
              onClose={onClose}
              title={ERoomCreateButtonName.LADDERGAME}
            />
          ) : (
            <ChooseGameModal
              onClose={onClose}
              title={ERoomCreateButtonName.NORMALGAME}
            />
          )}
        </>
      )}
    </>
  );
};

export default LobbyCreateRoomButtons;

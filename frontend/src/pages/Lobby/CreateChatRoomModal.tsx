import React, { useState } from "react";
import styled from "styled-components";
import CreateRoomModal from "./components/CreateRoomModal";
import CreateRoomModalContainer from "./components/CreateRoomModalContainer";

const CreateChatRoomModalStyled = styled(CreateRoomModalContainer)`
  width: 50%;
  height: 50%;
  justify-content: center;
`;

interface ICreateChatRoomModal {
  children: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const CreateChatRoomModal = ({
  children,
  setOpenModal,
}: ICreateChatRoomModal) => {
  return (
    <CreateChatRoomModalStyled>
      <CreateRoomModal setOpenModal={setOpenModal}>{children}</CreateRoomModal>
    </CreateChatRoomModalStyled>
  );
};

export default CreateChatRoomModal;

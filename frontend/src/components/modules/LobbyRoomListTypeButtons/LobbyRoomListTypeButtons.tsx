import React from "react";
import styled from "styled-components";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";

const RoomListTypeButton = styled(Button).attrs({
  width: "30%",
  height: "100%",
  boxShadow: true,
  fontSize: "2rem",
})``;

const LobbyRoomListTypeButtons = () => {
  return (
    <ButtonGroup height="6%" width="100%" justifyContent="space-evenly">
      <RoomListTypeButton>채팅방목록</RoomListTypeButton>
      <RoomListTypeButton>게임방목록</RoomListTypeButton>
    </ButtonGroup>
  );
};

export default LobbyRoomListTypeButtons;

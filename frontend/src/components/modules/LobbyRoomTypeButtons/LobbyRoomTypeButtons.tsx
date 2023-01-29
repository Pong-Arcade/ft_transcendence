import React from "react";
import Button from "../../atoms/Button";
import ButtonGroup from "../ButtonGroup";

const LobbyRoomTypeButtons = () => {
  return (
    <ButtonGroup height="6%" width="100%" justifyContent="space-evenly">
      <Button width="30%" height="100%" boxShadow fontSize="2rem">
        채팅방목록
      </Button>
      <Button width="30%" height="100%" boxShadow fontSize="2rem">
        진행중인게임
      </Button>
    </ButtonGroup>
  );
};

export default LobbyRoomTypeButtons;

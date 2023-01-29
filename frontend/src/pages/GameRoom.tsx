import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "../components/atoms/Avatar";
import Board from "../components/atoms/Board";
import Button from "../components/atoms/Button";
import ModalWrapper from "../components/atoms/ModalWrapper";
import Typography from "../components/atoms/Typography";
import Chat from "../components/modules/Chat";
import Menu from "../components/modules/Menu";
import UserInfoModal from "../components/modules/UserInfoModal";
import GameRoomTemplate from "../components/templates/GameRoomTemplate";

const GameBoard = styled(Board).attrs((props) => {
  return {
    width: "75%",
    height: "98%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
    boxShadow: true,
  };
})``;
const Wrapper = styled(Board).attrs({
  width: "24%",
  height: "98%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const UserProfileGroup = styled(Board).attrs({
  width: "98%",
  height: "35%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;
const UserProfile = styled(Button).attrs({
  width: "98%",
  height: "49%",
  boxShadow: true,
})`
  background-color: ${(props) => props.theme.background.middle};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const GameRoom = () => {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenUserInfo, setOpenUserInfo] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  const onOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPositionX(e.clientX);
    setPositionY(e.clientY);
    setOpenMenu(true);
  };
  const onClose = () => {
    setOpenMenu(false);
  };
  const onOpenMenuDetail = () => {
    setOpenUserInfo(true);
    setOpenMenu(false);
  };
  const onCloseMenuDetail = () => {
    setOpenUserInfo(false);
  };

  const userList = ["kangkim1", "kangkim2"];

  return (
    <>
      <GameRoomTemplate>
        <GameBoard></GameBoard>
        <Wrapper>
          <UserProfileGroup>
            {userList.map((user, idx) => (
              <UserProfile key={idx} onClick={onOpenMenu}>
                <Avatar width="8rem" height="8rem" />
                <Typography fontSize="2rem">{user}</Typography>
                <Typography fontSize="1.2rem">
                  {idx === 0 ? "(Left)" : "(Right)"}
                </Typography>
              </UserProfile>
            ))}
          </UserProfileGroup>
          <Chat width="98%" height="57%" />
          <Button width="22vw" height="6vh" boxShadow to="/lobby">
            나가기
          </Button>
        </Wrapper>
      </GameRoomTemplate>
      {isOpenMenu && (
        <ModalWrapper onClose={onClose} backgroundColor="none">
          <Menu
            list={["정보보기", "귓속말", "친구추가", "차단하기"]}
            top={positionY}
            left={positionX}
            onOpen={onOpenMenuDetail}
          />
        </ModalWrapper>
      )}
      {isOpenUserInfo && (
        <ModalWrapper onClose={onCloseMenuDetail}>
          <UserInfoModal onClose={onCloseMenuDetail} width="50%" height="90%" />
        </ModalWrapper>
      )}
    </>
  );
};

export default GameRoom;

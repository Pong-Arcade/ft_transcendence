import React, { useState } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import ButtonGroup from "../ButtonGroup";
import Menu from "../Menu";
import PaginationList from "../PaginationList";
import UserInfoModal from "../UserInfoModal";

const LobbyUserListStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "74%",
    borderRadius: true,
    backgroundColor: props.theme.background.middle,
    boxShadow: true,
    flexDirection: "column",
    justifyContent: "space-around",
  };
})``;

const LobbyUserList = () => {
  const buttonList = ["접속중인유저", "친구목록", "차단목록"];
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

  return (
    <>
      <LobbyUserListStyled>
        <ButtonGroup width="100%" height="15%" alignItems="center">
          {buttonList.map((title, idx) => (
            <Button width="31%" height="55%" boxShadow key={idx}>
              {title}
            </Button>
          ))}
        </ButtonGroup>
        <PaginationList
          list={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
          onOpen={onOpenMenu}
          display="grid"
          gridTemplate="repeat(5, 1fr) / 1fr"
          width="98%"
          height="90%"
        />
      </LobbyUserListStyled>
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

export default LobbyUserList;

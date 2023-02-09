import React, { useState } from "react";
import styled from "styled-components";
import useMenu from "../../../hooks/useMenu";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
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
  const { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY } =
    useMenu();
  const [isOpenUserInfo, setOpenUserInfo] = useState(false);

  const onOpenMenuDetail = () => {
    setOpenUserInfo(true);
    onCloseMenu();
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
          onClick={onOpenMenu}
          display="grid"
          gridTemplate="repeat(5, 1fr) / 1fr"
          width="98%"
          height="90%"
        />
      </LobbyUserListStyled>
      {isOpenMenu && ( // TODO: 정보보기 제외 다른 기능 추가 시 리팩토링 필요
        <Menu
          list={["정보보기", "귓속말", "친구추가", "차단하기"]}
          top={positionY}
          left={positionX}
          onOpen={onOpenMenuDetail}
        />
      )}
      {isOpenUserInfo && (
        <UserInfoModal onClose={onCloseMenuDetail} width="50%" height="90%" />
      )}
    </>
  );
};

export default LobbyUserList;

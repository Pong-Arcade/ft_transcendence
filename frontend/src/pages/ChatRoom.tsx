import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ChatRoomTemplate from "../components/templates/ChatRoomTemplate";
import Title from "../components/modules/Title";
import Chat from "../components/modules/Chat";
import Board from "../components/atoms/Board";
import ButtonGroup from "../components/modules/ButtonGroup";
import Button from "../components/atoms/Button";
import PaginationList from "../components/modules/PaginationList";
import Avatar from "../components/atoms/Avatar";
import ModalWrapper from "../components/atoms/ModalWrapper";
import Menu from "../components/modules/Menu";
import UserInfoModal from "../components/modules/UserInfoModal";

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "79%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const UserCardWrapper = styled(Board).attrs({
  width: "100%",
  height: "100%",
  flexDirection: "column",
  justifyContent: "space-around",
})``;

const UserName = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.colors.vividCerulean,
    borderRadius: true,
    width: "100%",
    height: "20%",
  };
})``;

const list: React.ReactNode[] = [];
for (let i = 0; i < 4; ++i) {
  list.push([
    <UserCardWrapper>
      <Avatar width="11rem" height="11rem" />
      <UserName>user{i}</UserName>
    </UserCardWrapper>,
  ]);
}

const ChatRoom = () => {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenUserInfo, setOpenUserInfo] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  const onOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPositionX(e.clientX);
    setPositionY(e.clientY);
    setOpenMenu(true);
  };
  const onMenuClose = () => {
    setOpenMenu(false);
  };
  const onOpenMenuDetail = () => {
    setOpenUserInfo(true);
    setOpenMenu(false);
  };
  const onCloseMenuDetail = () => {
    setOpenUserInfo(false);
  };

  const navigate = useNavigate();
  const onClose = () => {
    navigate("/lobby");
  };

  return (
    <>
      <ChatRoomTemplate>
        <Title fontSize="3rem" height="10%">
          ChatTitle
        </Title>
        <Wrapper>
          <PaginationList
            width="100%"
            height="44%"
            onOpen={onOpenMenu}
            list={list}
            flexDirection="row"
            display="grid"
            gridTemplate="1fr / repeat(5, 1fr)"
          />
          <Chat width="100%" height="55%" />
        </Wrapper>
        <ButtonGroup height="7%" width="100%" backgroundColor="secondary">
          <Button fontSize="2rem" height="95%" width="30%">
            초대하기
          </Button>
          <Button fontSize="2rem" height="95%" width="30%" onClick={onClose}>
            나가기
          </Button>
        </ButtonGroup>
      </ChatRoomTemplate>
      {isOpenMenu && (
        <ModalWrapper onClose={onMenuClose} backgroundColor="none">
          <Menu
            list={[
              "정보보기",
              "강퇴하기",
              "채팅금지",
              "관리자부여",
              "게임신청",
            ]}
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

export default ChatRoom;

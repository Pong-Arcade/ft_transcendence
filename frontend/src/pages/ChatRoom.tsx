import React, { useState } from "react";
import styled from "styled-components";
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
import useMenu from "../hooks/useMenu";
import useUserInfo from "../hooks/useUserInfo";
import useConfirm from "../hooks/useConfirm";
import ConfirmModal from "../components/modules/ConfirmModal";
import { EConfirmType } from "../components/modules/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "81%",
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
  const { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY } =
    useMenu();

  const { isOpenUserInfo, onOpenMenuDetail, onCloseMenuDetail } = useUserInfo({
    openAfter: () => {
      onCloseMenu();
    },
  });

  const { isOpenConfirm, onOpenConfirm, onCloseConfirm } = useConfirm();
  const navigate = useNavigate();
  const onYesConfirm = () => {
    navigate("/lobby");
  };
  const onNoConfirm = () => {
    onCloseConfirm();
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
          <Button fontSize="2rem" height="7vh" width="30vw">
            초대하기
          </Button>
          <Button
            fontSize="2rem"
            height="7vh"
            width="30vw"
            onClick={onOpenConfirm}
          >
            나가기
          </Button>
        </ButtonGroup>
      </ChatRoomTemplate>
      {isOpenMenu && ( // TODO: 정보보기 제외 다른 기능 추가 시 리팩토링 필요
        <ModalWrapper onClose={onCloseMenu} backgroundColor="none">
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
      {isOpenConfirm && (
        <ModalWrapper onClose={onCloseConfirm}>
          <ConfirmModal
            width="30%"
            height="30%"
            onClose={onCloseConfirm}
            type={EConfirmType.EXIT}
            onYesConfirm={onYesConfirm}
            onNoConfirm={onNoConfirm}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default ChatRoom;

import React from "react";
import styled from "styled-components";
import useMenu from "../../../hooks/useMenu";
import useModal from "../../../hooks/useModal";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import ModalWrapper from "../../atoms/ModalWrapper";
import Chat from "../Chat";
import Menu from "../Menu";
import PaginationList from "../PaginationList";
import UserInfoModal from "../UserInfoModal";

const ChatRoomUserListStyled = styled(Board).attrs({
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
    <UserCardWrapper key={i}>
      <Avatar width="11rem" height="11rem" />
      <UserName>user{i}</UserName>
    </UserCardWrapper>,
  ]);
}

const ChatRoomUserList = () => {
  const { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY } =
    useMenu();

  const {
    isModalOpen: isUserInfoOpen,
    onModalOpen: onUserInfoOpen,
    onModalClose: onUserInfoClose,
  } = useModal({
    afterOpen: () => {
      onCloseMenu();
    },
  });

  return (
    <>
      <ChatRoomUserListStyled>
        <PaginationList
          width="100%"
          height="44%"
          onClick={onOpenMenu}
          list={list}
          flexDirection="row"
          display="grid"
          gridTemplate="1fr / repeat(5, 1fr)"
        />
        <Chat width="100%" height="55%" />
      </ChatRoomUserListStyled>
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
            onOpen={onUserInfoOpen}
          />
        </ModalWrapper>
      )}
      {isUserInfoOpen && (
        <ModalWrapper>
          <UserInfoModal onClose={onUserInfoClose} width="50%" height="90%" />
        </ModalWrapper>
      )}
    </>
  );
};

export default ChatRoomUserList;

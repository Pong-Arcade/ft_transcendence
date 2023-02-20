import { MouseEvent, useState } from "react";
import styled from "styled-components";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import UserInfoModal from "../UserInfoModal";
import RelationConfirmModal from "../RelationConfirmModal";
import { useRecoilValue } from "recoil";
import friendUsersState from "../../../state/FriendUsersState";
import blockUsersState from "../../../state/BlockUsersState";

interface Props {
  top: number;
  left: number;
  isOpenMenu: boolean;
  onClose: () => void;
  userId: number;
  name: string;
}

interface MenuStyledProps {
  top: number;
  left: number;
}

const MenuStyled = styled(Modal).attrs((props) => {
  return {
    width: "10vw",
    height: "22vh",
    backgroundColor: props.theme.colors.spiroDiscoBall,
  };
})<MenuStyledProps>`
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  font-size: 1.5rem;
`;
export enum EChatRoom {
  INFO = "정보보기",
  ADD_FRIEND = "친구추가",
  DEL_FRIEND = "친구삭제",
  ADD_BLOCK = "차단하기",
  DEL_BLOCK = "차단해제",
  APPLY_GAME = "게임신청",
  BAN = "강퇴하기", // 관리자만 보이기
  MUTE = "채팅금지", // 관리자만 보이기
  UNMUTE = "채팅금지해제", // 관리자만 보이기
  PROMOTE = "관리자임명", // 방장만 보이기
  DEMOTE = "관리자해임", // 방장만 보이기
}

export enum EChatCurrentOn {
  ADD_FRIEND = "ADD_FRIEND",
  DEL_FRIEND = "DEL_FRIEND",
  ADD_BLOCK = "ADD_BLOCK",
  DEL_BLOCK = "DEL_BLOCK",
  MUTE = "MUTE",
  UNMUTE = "UNMUTE",
  PROMOTE = "PROMOTE",
  DEMOTE = "DEMOTE",
}

const MenuButton = styled(Button).attrs({
  width: "100%",
  border: "none",
  height: "25%",
})``;

const GeneralMenu = ({
  onClose,
  isOpenMenu,
  userId,
  name,
  top,
  left,
  ...rest
}: Props) => {
  const {
    isModalOpen: isUserInfoOpen,
    onModalOpen: onUserInfoOpen,
    onModalClose: onUserInfoClose,
  } = useModal({
    afterOpen: () => {
      onClose();
    },
  });
  const {
    isModalOpen: isConfirmOpen,
    onModalOpen: onConfirmOpen,
    onModalClose: onConfirmClose,
  } = useModal({
    afterOpen: () => {
      onClose();
    },
  });
  const friendUsers = useRecoilValue(friendUsersState);
  const blockUsers = useRecoilValue(blockUsersState);
  const [currentOn, setCurrentOn] = useState<EChatCurrentOn>();
  const [isMute, setIsMute] = useState(false);
  const [isPromote, setIsPromote] = useState(false);

  const isFriend = friendUsers.find((user) => user.userId === userId);
  const isBlock = blockUsers.find((user) => user.userId === userId);

  const checkedTop =
    top > window.innerHeight - window.innerHeight * 0.15
      ? top - window.innerHeight * 0.15
      : top;
  const checkedLeft =
    left > window.innerWidth - window.innerWidth * 0.1
      ? left - window.innerWidth * 0.1
      : left;

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const { innerText } = e.currentTarget;
    switch (innerText) {
      case EChatRoom.INFO:
        onUserInfoOpen();
        break;
      case EChatRoom.ADD_FRIEND:
        setCurrentOn(EChatCurrentOn.ADD_FRIEND);
        onConfirmOpen();
        break;
      case EChatRoom.DEL_FRIEND:
        setCurrentOn(EChatCurrentOn.DEL_FRIEND);
        onConfirmOpen();
        break;
      case EChatRoom.ADD_BLOCK:
        setCurrentOn(EChatCurrentOn.ADD_BLOCK);
        onConfirmOpen();
        break;
      case EChatRoom.DEL_BLOCK:
        setCurrentOn(EChatCurrentOn.DEL_BLOCK);
        onConfirmOpen();
        break;
      case EChatRoom.APPLY_GAME:
        onConfirmOpen();
        break;
      case EChatRoom.BAN:
        onConfirmOpen();
        break;
      case EChatRoom.MUTE:
        setCurrentOn(EChatCurrentOn.MUTE);
        setIsMute(true);
        onConfirmOpen();
        break;
      case EChatRoom.UNMUTE:
        setCurrentOn(EChatCurrentOn.UNMUTE);
        setIsMute(false);
        onConfirmOpen();
        break;
      case EChatRoom.PROMOTE:
        setCurrentOn(EChatCurrentOn.PROMOTE);
        setIsPromote(true);
        onConfirmOpen();
        break;
      case EChatRoom.DEMOTE:
        setCurrentOn(EChatCurrentOn.DEMOTE);
        setIsPromote(false);
        onConfirmOpen();
        break;
    }
  };

  return (
    <>
      {isOpenMenu && (
        <ModalWrapper onClose={onClose} backgroundColor="none">
          <MenuStyled top={checkedTop} left={checkedLeft} {...rest}>
            <MenuButton onClick={onClick}>{EChatRoom.INFO}</MenuButton>
            {isFriend ? (
              <MenuButton onClick={onClick}>{EChatRoom.DEL_FRIEND}</MenuButton>
            ) : (
              <MenuButton onClick={onClick}>{EChatRoom.ADD_FRIEND}</MenuButton>
            )}
            {isBlock ? (
              <MenuButton onClick={onClick}>{EChatRoom.DEL_BLOCK}</MenuButton>
            ) : (
              <MenuButton onClick={onClick}>{EChatRoom.ADD_BLOCK}</MenuButton>
            )}
            <MenuButton onClick={onClick}>{EChatRoom.APPLY_GAME}</MenuButton>
            <MenuButton onClick={onClick}>{EChatRoom.BAN}</MenuButton>
            {isMute ? (
              <MenuButton onClick={onClick}>{EChatRoom.UNMUTE}</MenuButton>
            ) : (
              <MenuButton onClick={onClick}>{EChatRoom.MUTE}</MenuButton>
            )}
            {isPromote ? (
              <MenuButton onClick={onClick}>{EChatRoom.DEMOTE}</MenuButton>
            ) : (
              <MenuButton onClick={onClick}>{EChatRoom.PROMOTE}</MenuButton>
            )}
          </MenuStyled>
        </ModalWrapper>
      )}
      {isUserInfoOpen && (
        <UserInfoModal
          userId={userId}
          onClose={onUserInfoClose}
          width="50%"
          height="90%"
        />
      )}
      {isConfirmOpen && (
        <RelationConfirmModal
          onNoConfirm={onConfirmClose}
          onClose={onConfirmClose}
          currentOn={currentOn} // TODO: chat menu 기능 넣어서 confirmModal 수정
          userId={userId}
          name={name}
        />
      )}
    </>
  );
};

export default GeneralMenu;
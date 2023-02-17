import { MouseEvent, useState } from "react";
import styled from "styled-components";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import UserInfoModal from "../UserInfoModal";
import RelationConfirmModal from "../RelationConfirmModal";
import { useRecoilValue } from "recoil";
import { friendUsersState } from "../../../state/friendUsersState";
import { blockUsersState } from "../../../state/blockUsersState";

interface Props {
  top: number;
  left: number;
  isOpenMenu: boolean;
  onClose: () => void;
  userId: string;
  name: string;
}

interface MenuStyledProps {
  top: number;
  left: number;
}

const MenuStyled = styled(Modal).attrs((props) => {
  return {
    width: "10vw",
    height: "15vh",
    backgroundColor: props.theme.colors.spiroDiscoBall,
  };
})<MenuStyledProps>`
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  font-size: 1.5rem;
`;

export enum EMenu {
  INFO = "정보보기",
  WHISPHER = "귓속말",
  ADD_FRIEND = "친구추가",
  DEL_FRIEND = "친구삭제",
  ADD_BLOCK = "차단하기",
  DEL_BLOCK = "차단해제",
}
export enum ECurrentOn {
  ADD_FRIEND = "ADD_FRIEND",
  DEL_FRIEND = "DEL_FRIEND",
  ADD_BLOCK = "ADD_BLOCK",
  DEL_BLOCK = "DEL_BLOCK",
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
  const [currentOn, setCurrentOn] = useState<ECurrentOn>();

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
      case EMenu.INFO:
        onUserInfoOpen();
        break;
      case EMenu.WHISPHER:
        break;
      case EMenu.ADD_FRIEND:
        setCurrentOn(ECurrentOn.ADD_FRIEND);
        onConfirmOpen();
        break;
      case EMenu.DEL_FRIEND:
        setCurrentOn(ECurrentOn.DEL_FRIEND);
        onConfirmOpen();
        break;
      case EMenu.ADD_BLOCK:
        setCurrentOn(ECurrentOn.ADD_BLOCK);
        onConfirmOpen();
        break;
      case EMenu.DEL_BLOCK:
        setCurrentOn(ECurrentOn.DEL_BLOCK);
        onConfirmOpen();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {isOpenMenu && (
        <ModalWrapper onClose={onClose} backgroundColor="none">
          <MenuStyled top={checkedTop} left={checkedLeft} {...rest}>
            <MenuButton onClick={onClick}>{EMenu.INFO}</MenuButton>
            <MenuButton onClick={onClick}>{EMenu.WHISPHER}</MenuButton>
            {isFriend ? (
              <MenuButton onClick={onClick}>{EMenu.DEL_FRIEND}</MenuButton>
            ) : (
              <MenuButton onClick={onClick}>{EMenu.ADD_FRIEND}</MenuButton>
            )}
            {isBlock ? (
              <MenuButton onClick={onClick}>{EMenu.DEL_BLOCK}</MenuButton>
            ) : (
              <MenuButton onClick={onClick}>{EMenu.ADD_BLOCK}</MenuButton>
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
          currentOn={currentOn}
          userId={userId}
          name={name}
        />
      )}
    </>
  );
};

export default GeneralMenu;

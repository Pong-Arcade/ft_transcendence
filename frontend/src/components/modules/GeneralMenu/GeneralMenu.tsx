import styled from "styled-components";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import UserInfoModal from "../UserInfoModal";

import useGeneralMenu from "../../../hooks/useGeneralMenu";

interface Props {
  top: number;
  left: number;
  isOpenMenu: boolean;
  onClose: () => void;
  userId: number;
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

enum EMenu {
  INFO = "정보보기",
  WHISPHER = "귓속말",
  ADD_FRIEND = "친구추가",
  DEL_FRIEND = "친구삭제",
  ADD_BLOCK = "차단하기",
  DEL_BLOCK = "차단해제",
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
    friendUsers,
    blockUsers,
    onAddFriend,
    onDelFriend,
    onAddBlock,
    onDelBlock,
  } = useGeneralMenu(userId);

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

  return (
    <>
      {isOpenMenu && (
        <ModalWrapper onClose={onClose} backgroundColor="none">
          <MenuStyled top={checkedTop} left={checkedLeft} {...rest}>
            <MenuButton onClick={onUserInfoOpen}>{EMenu.INFO}</MenuButton>
            <MenuButton>{EMenu.WHISPHER}</MenuButton>
            {isFriend ? (
              <MenuButton onClick={onDelFriend}>{EMenu.DEL_FRIEND}</MenuButton>
            ) : (
              <MenuButton onClick={onAddFriend}>{EMenu.ADD_FRIEND}</MenuButton>
            )}
            {isBlock ? (
              <MenuButton onClick={onDelBlock}>{EMenu.DEL_BLOCK}</MenuButton>
            ) : (
              <MenuButton onClick={onAddBlock}>{EMenu.ADD_BLOCK}</MenuButton>
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
    </>
  );
};

export default GeneralMenu;

import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  deleteFriendUsersAPI,
  getFriendUsersAPI,
  patchFriendUsersAPI,
} from "../../../api/users";
import useModal from "../../../hooks/useModal";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import UserInfoModal from "../UserInfoModal";
import { friendUsersState } from "../../../state/FriendUsersState";

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

const GeneralMenu = ({ onClose, isOpenMenu, userId, ...rest }: Props) => {
  const {
    isModalOpen: isUserInfoOpen,
    onModalOpen: onUserInfoOpen,
    onModalClose: onUserInfoClose,
  } = useModal({
    afterOpen: () => {
      onClose();
    },
  });
  const [friendUsers, setFriendUsers] = useRecoilState(friendUsersState);

  const onAddFriend = async () => {
    const response = await patchFriendUsersAPI(userId);
    if (response.status === 201) {
      const newFriendUsers = await getFriendUsersAPI();
      setFriendUsers(newFriendUsers);
    }
  };
  const onDelFriend = async () => {
    const response = await deleteFriendUsersAPI(userId);
    if (response.status === 204) {
      const newFriendUsers = await getFriendUsersAPI();
      setFriendUsers(newFriendUsers);
    }
  };

  const isFriend = friendUsers.find((user) => user.userId === userId);

  return (
    <>
      {isOpenMenu && (
        <ModalWrapper onClose={onClose} backgroundColor="none">
          <MenuStyled {...rest}>
            <MenuButton onClick={onUserInfoOpen}>{EMenu.INFO}</MenuButton>
            <MenuButton>{EMenu.WHISPHER}</MenuButton>
            {isFriend ? (
              <MenuButton onClick={onDelFriend}>{EMenu.DEL_FRIEND}</MenuButton>
            ) : (
              <MenuButton onClick={onAddFriend}>{EMenu.ADD_FRIEND}</MenuButton>
            )}
            <MenuButton>{EMenu.INFO}</MenuButton>
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

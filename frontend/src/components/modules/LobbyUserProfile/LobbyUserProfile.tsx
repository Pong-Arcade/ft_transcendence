import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useModal from "../../../hooks/useModal";
import { IInfoState } from "../../../state/InfoState";
import { removeJWT } from "../../../utils/token";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import LogoutButton from "../LogoutButton";
import LogoutConfirmModal from "../LogoutConfirmModal";
import UserInfoModal from "../UserInfoModal";
import { logoutAPI } from "../../../api/auth";
import { useSetRecoilState } from "recoil";
import errorState from "../../../state/ErrorState";
import { useContext } from "react";
import { SocketContext } from "../../../utils/ChatSocket";
import GameSocket from "../../../state/GameSocket";

const LobbyUserProfileStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "25%",
    borderRadius: true,
    backgroundColor: props.theme.background.middle,
    boxShadow: true,
  };
})``;

const UserInfo = styled(Board).attrs((props) => {
  return {
    width: "50%",
    height: "100%",
    backgroundColor: props.theme.background.middle,
    flexDirection: "column",
    justifyContent: "center",
  };
})``;

const NicknameWrapper = styled.div`
  width: 100%;
  height: 40%;
  background-color: ${(props) => props.theme.background.middle};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  info: IInfoState;
}

const ProfileButton = styled(Button).attrs({
  width: "80%",
  height: "45%",
  boxShadow: true,
  fontSize: "1.5rem",
})``;

const LobbyUserProfile = ({ info }: Props) => {
  const socket = useContext(SocketContext);
  const gameSocket = useContext(GameSocket);
  const setError = useSetRecoilState(errorState);
  const {
    isModalOpen: isConfirmOpen,
    onModalOpen: onConfirmOpen,
    onModalClose: onConfirmClose,
  } = useModal({});
  const {
    isModalOpen: isUserInfoOpen,
    onModalOpen: onUserInfoOpen,
    onModalClose: onUserInfoClose,
  } = useModal({});

  const navigate = useNavigate();
  const onYesConfirm = async () => {
    try {
      await logoutAPI();
      removeJWT();
      socket.socket.close();
      gameSocket.socket.close();
      navigate("/");
    } catch (error) {
      setError({ isError: true, error });
    }
  };

  return (
    <>
      <LobbyUserProfileStyled>
        <LogoutButton onClick={onConfirmOpen} />
        <Avatar width={"10rem"} height={"10rem"} src={info.avatarUrl} />
        <UserInfo>
          <NicknameWrapper>
            <Typography fontSize="3rem">{info.nickname}</Typography>
          </NicknameWrapper>
          <ButtonGroup
            height="60%"
            width="100%"
            justifyContent="space-around"
            flexDirection="column"
          >
            <ProfileButton onClick={onUserInfoOpen}>내정보</ProfileButton>
            <ProfileButton to="/ranking">랭킹</ProfileButton>
          </ButtonGroup>
        </UserInfo>
      </LobbyUserProfileStyled>
      {isUserInfoOpen && (
        <UserInfoModal userId={info.userId} onClose={onUserInfoClose} />
      )}
      {isConfirmOpen && (
        <LogoutConfirmModal
          onClose={onConfirmClose}
          onYesConfirm={onYesConfirm}
          onNoConfirm={() => onConfirmClose()}
        />
      )}
    </>
  );
};

export default LobbyUserProfile;

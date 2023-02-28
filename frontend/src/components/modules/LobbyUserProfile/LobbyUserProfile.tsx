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

const Wrapper = styled.div`
  display: grid;
  grid-template: repeat(3, 1fr) / 1fr;
  width: 100%;
  height: 50%;
  background-color: ${(props) => props.theme.background.middle};
  text-align: center;
`;

interface Props {
  info: IInfoState;
}

const ProfileButton = styled(Button).attrs({
  width: "6vw",
  height: "5vh",
  boxShadow: true,
  fontSize: "1.5rem",
})``;

const LobbyUserProfile = ({ info }: Props) => {
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
  const onYesConfirm = () => {
    removeJWT();
    navigate("/");
  };

  return (
    <>
      <LobbyUserProfileStyled>
        <LogoutButton onClick={onConfirmOpen} />
        <Avatar width={"10rem"} height={"10rem"} src={info.avatarUrl} />
        <UserInfo>
          <Wrapper>
            <Typography fontSize="1.5rem">{info.nickname}</Typography>
            <Typography fontSize="1.5rem">2승 2패 (50%)</Typography>
            <Typography fontSize="1.5rem">1020 점</Typography>
          </Wrapper>
          <ButtonGroup height="30%" width="100%" justifyContent="space-between">
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

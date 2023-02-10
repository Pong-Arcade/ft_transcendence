import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useModal from "../../../hooks/useModal";
import removeJWT from "../../../utils/removeJWT";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ConfirmModal from "../ConfirmModal";
import { EConfirmType } from "../ConfirmModal/ConfirmModal";
import LogoutButton from "../LogoutButton";
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

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "50%",
  flexDirection: "column",
})`
  gap: 0.5rem;
`;

const LobbyUserProfile = () => {
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
        <Avatar width={"10rem"} height={"10rem"} />
        <UserInfo>
          <Wrapper>
            <Typography fontSize="1.5rem">user1</Typography>
            <Typography fontSize="1.5rem">2승 2패 (50%)</Typography>
            <Typography fontSize="1.5rem">1020 점</Typography>
          </Wrapper>
          <ButtonGroup height="30%" width="100%" justifyContent="space-between">
            <Button
              width="7vw"
              height="5vh"
              boxShadow
              fontSize="1.5rem"
              onClick={onUserInfoOpen}
            >
              내정보
            </Button>
            <Button
              width="7vw"
              height="5vh"
              boxShadow
              to="/ranking"
              fontSize="1.5rem"
            >
              랭킹
            </Button>
          </ButtonGroup>
        </UserInfo>
      </LobbyUserProfileStyled>
      {isUserInfoOpen && (
        <UserInfoModal onClose={onUserInfoClose} width="50%" height="90%" me />
      )}
      {isConfirmOpen && (
        <ConfirmModal
          onClose={onConfirmClose}
          type={EConfirmType.LOGOUT}
          onYesConfirm={onYesConfirm}
          onNoConfirm={() => onConfirmClose()}
        />
      )}
    </>
  );
};

export default LobbyUserProfile;

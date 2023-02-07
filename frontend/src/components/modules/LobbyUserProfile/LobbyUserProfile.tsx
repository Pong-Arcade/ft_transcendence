import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { logoutAPI } from "../../../api/auth";
import useConfirm from "../../../hooks/useConfirm";
import useUserInfo from "../../../hooks/useUserInfo";
import LoadingState from "../../../state/LoadingState";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
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
  const { isOpenConfirm, onOpenConfirm, onCloseConfirm } = useConfirm();
  const { isOpenUserInfo, onOpenMenuDetail, onCloseMenuDetail } = useUserInfo(
    {}
  );
  const setIsLoading = useSetRecoilState(LoadingState);

  const navigate = useNavigate();
  const onYesConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await logoutAPI();
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  const onNoConfirm = () => {
    onCloseConfirm();
  };

  return (
    <>
      <LobbyUserProfileStyled>
        <LogoutButton onClick={onOpenConfirm} />
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
              onClick={onOpenMenuDetail}
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
      {isOpenUserInfo && (
        <ModalWrapper onClose={onCloseMenuDetail}>
          <UserInfoModal
            onClose={onCloseMenuDetail}
            width="50%"
            height="90%"
            me
          />
        </ModalWrapper>
      )}
      {isOpenConfirm && (
        <ModalWrapper>
          <ConfirmModal
            onClose={onCloseConfirm}
            type={EConfirmType.LOGOUT}
            onYesConfirm={onYesConfirm}
            onNoConfirm={onNoConfirm}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default LobbyUserProfile;

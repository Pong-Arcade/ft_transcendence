import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
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

// TODO: Logout api 추가
const LobbyUserProfile = () => {
  const [isOpenUserInfo, setOpenUserInfo] = useState(false);
  const onOpenMenuDetail = () => {
    setOpenUserInfo(true);
  };
  const onCloseMenuDetail = () => {
    setOpenUserInfo(false);
  };

  return (
    <>
      <LobbyUserProfileStyled>
        <LogoutButton to="/" />
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
          <UserInfoModal onClose={onCloseMenuDetail} width="50%" height="90%" />
        </ModalWrapper>
      )}
    </>
  );
};

export default LobbyUserProfile;

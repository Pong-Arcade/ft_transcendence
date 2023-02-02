import React from "react";
import styled from "styled-components";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import LogoutButton from "../LogoutButton";

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
  return (
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
            to="/rank"
            fontSize="1.5rem"
          >
            랭킹
          </Button>
          <Button
            width="7vw"
            height="5vh"
            boxShadow
            to="/stat/1"
            fontSize="1.5rem"
          >
            최근전적
          </Button>
        </ButtonGroup>
      </UserInfo>
    </LobbyUserProfileStyled>
  );
};

export default LobbyUserProfile;

import React from "react";
import styled from "styled-components";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";

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
  };
})`
  gap: 0.5rem;
`;

const LobbyUserProfile = () => {
  return (
    <LobbyUserProfileStyled>
      <Avatar width={"10rem"} height={"10rem"} />
      <UserInfo>
        <Typography fontSize="1.5rem">user1</Typography>
        <Typography fontSize="1.5rem">2승 2패 (50%)</Typography>
        <Typography fontSize="1.5rem">1020 점</Typography>
        <Button
          width="10vw"
          height="5vh"
          boxShadow
          to="/rank"
          fontSize="1.5rem"
        >
          랭킹
        </Button>
      </UserInfo>
    </LobbyUserProfileStyled>
  );
};

export default LobbyUserProfile;

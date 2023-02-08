import React from "react";
import styled from "styled-components";
import { ReactComponent as Logo } from "../../../assets/logout.svg";
import Button from "../../atoms/Button";

interface Props {
  onClick?: () => void;
}

const LogoutLogo = styled(Logo)`
  width: 100%;
  height: 100%;
`;

const LogoutButtonStyled = styled(Button)`
  background-color: ${(props) => props.theme.background.middle};
  position: absolute;
  top: 2.5%;
  left: 2%;
  border: none;
  width: 3.5%;
  height: 4.5%;
`;

const LogoutButton = ({ onClick }: Props) => {
  return (
    <LogoutButtonStyled width="3.5%" height="4.5%" onClick={onClick}>
      <LogoutLogo />
    </LogoutButtonStyled>
  );
};

export default LogoutButton;
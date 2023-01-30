import React from "react";
import styled from "styled-components";
import { ReactComponent as Logo } from "../../../assets/42logo.svg";

const MainLogoStyled = styled(Logo)`
  width: 3.5rem;
  height: 3.5rem;
`;

const MainLogo = () => {
  return <MainLogoStyled />;
};

export default MainLogo;

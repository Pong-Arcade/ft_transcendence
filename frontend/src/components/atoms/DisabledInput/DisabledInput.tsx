import React from "react";
import styled from "styled-components";
import Board from "../Board";

const DisabledInputStyled = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.colors.chineseWhite,
    width: "100%",
    height: "100%",
    borderRadius: true,
  };
})``;

const DisabledInput = () => {
  return <DisabledInputStyled></DisabledInputStyled>;
};

export default DisabledInput;

import React from "react";
import styled from "styled-components";
import Board from "../boards/Board";

const Modal = styled(Board)`
  background-color: ${(props) => props.theme.colors.freshAir};
  flex-direction: column;
  position: absolute;
`;
export default Modal;

import React from "react";
import styled from "styled-components";
import Board from "../boards/Board";

interface IContextList {
  width: string;
  height: string;
  backgroundColor?: string;
  gap?: string;
}

const ContextList = styled(Board)<IContextList>`
  flex-direction: column;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.backgroundColor
      ? props.backgroundColor
      : props.theme.background.middle};
  gap: ${(props) => (props.gap ? props.gap : null)};
`;

export default ContextList;

import React from "react";
import styled from "styled-components";

interface Props {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  backgroundColor?: string;
  boxShadow?: boolean;
  borderRadius?: boolean;
  flexDirection?: "row" | "column";
  justifyContent?: string;
  alignItems?: string;
}

const BoardStyled = styled.div<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  box-shadow: ${(props) => props.boxShadow && props.theme.box.shadow};
  border-radius: ${(props) => props.borderRadius && props.theme.border.board};
  display: flex;
  flex-direction: ${(props) => props.flexDirection || "row"};
  justify-content: ${(props) => props.justifyContent || "center"};
  align-items: ${(props) => props.alignItems || "center"};
`;

const Board = ({ children, ...rest }: Props) => {
  if (!children) {
    return <BoardStyled {...rest} />;
  }
  return <BoardStyled {...rest}>{children}</BoardStyled>;
};

export default Board;

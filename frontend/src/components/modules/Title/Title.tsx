import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

interface Props {
  children: React.ReactNode;
  height?: string;
  fontSize?: string;
}

const TitleStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: props.height || "15%",
    backgroundColor: props.theme.colors.vividCerulean,
    borderRadius: true,
    boxShadow: true,
  };
})<Props>`
  font-size: ${(props) => props.fontSize || "1rem"};
`;

const Title = ({ children, ...rest }: Props) => {
  return <TitleStyled {...rest}>{children}</TitleStyled>;
};

export default Title;

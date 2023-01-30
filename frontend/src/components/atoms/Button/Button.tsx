import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  width: string;
  height: string;
  fontSize?: string;
  boxShadow?: boolean;
  borderRadius?: string;
  backgroundColor?: string;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  border?: string;
}

const ButtonStyled = styled.button<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  font-size: ${(props) => props.fontSize || "1.5rem"};
  background-color: ${(props) =>
    props.backgroundColor
      ? props.backgroundColor
      : props.theme.colors.spiroDiscoBall};
  box-shadow: ${(props) => props.boxShadow && props.theme.box.shadow};
  border-radius: ${(props) => props.theme.border.board};
  border: ${(props) => props.border || "medium solid rgba(0, 0, 0, 0.1)"};
  cursor: pointer;
  transition: 0.5s;

  overflow: hidden;
  white-space: nowrap;
  &:hover {
    box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
    background-color: ${(props) => props.theme.colors.blueCola};
  }
`;

const Button = ({ children, to, ...rest }: Props) => {
  if (to) {
    return (
      <Link to={to}>
        <ButtonStyled {...rest}>{children}</ButtonStyled>
      </Link>
    );
  }
  return <ButtonStyled {...rest}>{children}</ButtonStyled>;
};

export default Button;

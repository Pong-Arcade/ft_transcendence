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
  disabled?: boolean;
  type?: "button" | "reset" | "submit" | undefined;
}

const ButtonStyled = styled.button.attrs((props) => {
  return {
    disabled: props.disabled && props.disabled,
    type: props.type || "button",
  };
})<Props>`
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

interface LinkWrapperProps {
  width: string;
  height: string;
}

const LinkWrapper = styled(Link)<LinkWrapperProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const Button = ({ children, to, width, height, ...rest }: Props) => {
  if (to) {
    return (
      <LinkWrapper height={height} width={width} to={to}>
        <ButtonStyled width="100%" height="100%" {...rest}>
          {children}
        </ButtonStyled>
      </LinkWrapper>
    );
  }
  return (
    <ButtonStyled width={width} height={height} {...rest}>
      {children}
    </ButtonStyled>
  );
};

export default Button;

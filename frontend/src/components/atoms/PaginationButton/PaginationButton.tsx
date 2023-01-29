import React from "react";
import styled from "styled-components";
import Button from "../Button";

interface Props {
  children?: React.ReactNode;
  width: string;
  height: string;
  direction?: "left" | "right";
  backgroundColor?: string;
  fontSize?: string;
  disabled?: boolean;
}

const PaginationButtonStyled = styled(Button).attrs((props) => {
  return {
    width: props.width,
    height: props.height,
    backgroundColor: props.backgroundColor
      ? props.backgroundColor
      : props.theme.colors.spiroDiscoBall,
    fontSize: props.fontSize || "1rem",
    boxShadow: true,
  };
})`
  font-weight: 900;
`;
// TODO: pagaination block
/* ${(props) => props.disabled &&} */

const PaginationButton = ({ children, direction, ...rest }: Props) => {
  if (!direction) {
    return (
      <PaginationButtonStyled {...rest}>{children}</PaginationButtonStyled>
    );
  }
  if (direction === "left") {
    return <PaginationButtonStyled {...rest}>〈</PaginationButtonStyled>;
  }
  return <PaginationButtonStyled {...rest}>〉</PaginationButtonStyled>;
};

export default PaginationButton;

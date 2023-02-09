import React from "react";
import styled from "styled-components";
import Button from "../Button";

interface Props {
  children?: React.ReactNode;
  backgroundColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ListItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.backgroundColor
      ? props.backgroundColor
      : props.theme.background.front,
  };
})``;

const ListItem = ({ children, onClick, ...rest }: Props) => {
  return (
    <ListItemStyled onClick={onClick} {...rest}>
      {children}
    </ListItemStyled>
  );
};

export default ListItem;

import React from "react";
import styled from "styled-components";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";

interface Props {
  list?: string[];
  width?: string;
  height?: string;
  fontSize?: string;
  top: number;
  left: number;
  backgroundColor?: string;
  onOpen?: () => void;
}

const MenuStyled = styled(Modal).attrs((props) => {
  return {
    width: props.width || "10vw",
    height: props.height || "15vh",
    backgroundColor: props.backgroundColor || props.theme.colors.spiroDiscoBall,
  };
})<Props>`
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  font-size: ${(props) => props.fontSize || "1.5rem"};
`;

const Menu = ({ list, onOpen, ...rest }: Props) => {
  if (!list) return null;

  const height = `${100 / list.length}%`;
  return (
    <MenuStyled {...rest}>
      {list.map((elem, idx) => (
        <Button
          key={idx}
          width="100%"
          height={height}
          border="none"
          onClick={onOpen}
        >
          {elem}
        </Button>
      ))}
    </MenuStyled>
  );
};

export default Menu;

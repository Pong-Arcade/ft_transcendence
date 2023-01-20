import React from "react";
import styled from "styled-components";
import Board from "../boards/Board";
import ModalCloseButton from "./ModalCloseButton";

interface IModalTitleStyled {
  fontSize: string;
  height?: string;
}

const ModalTitleStyled = styled(Board)<IModalTitleStyled>`
  background-color: ${(props) => props.theme.colors.vividCerulean};
  width: 100%;
  height: ${(props) => (props.height ? props.height : "20%")};
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "1rem")};
  position: relative;
`;

interface IModalTitle {
  title: string;
  height?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  titleFontSize: string;
}

const ModalTitle = ({
  title,
  setOpenModal,
  titleFontSize,
  height,
}: IModalTitle) => {
  return (
    <ModalTitleStyled fontSize={titleFontSize} height={height}>
      {title}
      <ModalCloseButton setOpenModal={setOpenModal} />
    </ModalTitleStyled>
  );
};
export default ModalTitle;

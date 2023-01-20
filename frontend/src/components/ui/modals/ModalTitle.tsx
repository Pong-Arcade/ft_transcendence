import React from "react";
import styled from "styled-components";
import Board from "../boards/Board";
import ModalCloseButton from "./ModalCloseButton";

interface IModalTitleStyled {
  fontSize: string;
}

const ModalTitleStyled = styled(Board)<IModalTitleStyled>`
  background-color: ${(props) => props.theme.colors.vividCerulean};
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "1rem")};
  position: relative;
`;

interface IModalTitle {
  title: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  titleFontSize: string;
}

const ModalTitle = ({ title, setOpenModal, titleFontSize }: IModalTitle) => {
  return (
    <ModalTitleStyled fontSize={titleFontSize}>
      {title}
      <ModalCloseButton setOpenModal={setOpenModal} />
    </ModalTitleStyled>
  );
};
export default ModalTitle;

import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import ModalTitle from "../ModalTitle";

interface Props {
  children: React.ReactNode;
  width?: string;
  height?: string;
  title: string;
  titleFontSize?: string;
  titleHeight?: string;
  onClose: () => void;
}

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "79%",
  borderRadius: true,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
})`
  background-color: ${(props) => props.theme.background.middle};
`;

const ConfirmModal = ({
  children,
  width,
  height,
  title,
  titleFontSize,
  titleHeight,
  onClose,
}: Props) => {
  return (
    <ModalWrapper>
      <Modal width={width || "30%"} height={height || "30%"}>
        <ModalTitle
          height={titleHeight || "20%"}
          onClose={onClose}
          fontSize={titleFontSize || "3rem"}
        >
          {title}
        </ModalTitle>
        <Wrapper>{children}</Wrapper>
      </Modal>
    </ModalWrapper>
  );
};

export default ConfirmModal;

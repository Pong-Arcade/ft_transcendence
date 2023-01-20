import React from "react";
import styled from "styled-components";

interface IModalContainer {
  backgroundColor?: string;
}

const ModalContainer = styled.div<IModalContainer>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "rgba(0, 0, 0, 0.75)"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ModalContainer;

import React from "react";
import styled from "styled-components";
import Modal from "./Modal";

interface ISubModal {
  top: number;
  left: number;
  width: string;
  height: string;
}

const SubModal = styled(Modal)<ISubModal>`
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export default SubModal;

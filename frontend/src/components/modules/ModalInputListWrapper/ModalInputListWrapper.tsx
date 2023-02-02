import styled from "styled-components";
import Board from "../../atoms/Board";

interface IModalInputListWrapper {
  gridTemplate?: string;
}

const ModalInputListWrapper = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: props.height || "72%",
    borderRadius: true,
    boxShadow: false,
  };
})<IModalInputListWrapper>`
  display: grid;
  grid-template: ${(props) => props.gridTemplate};
  gap: 0.1vh;
`;

export default ModalInputListWrapper;

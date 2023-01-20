import styled from "styled-components";
import Board from "../boards/Board";

const SubModalButtonGroup = styled(Board)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.spiroDiscoBall};
`;

export default SubModalButtonGroup;

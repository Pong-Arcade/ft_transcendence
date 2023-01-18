import React from "react";
import styled from "styled-components";

const ListElement = styled.button`
  min-height: 6vh;
  background-color: ${(props) => props.theme.colors.blueCola};
  text-align: start;
  font-size: 1.1rem;
`;

export default ListElement;

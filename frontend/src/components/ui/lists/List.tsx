import React from "react";
import styled from "styled-components";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: nowrap;
  background-color: ${(props) => props.theme.colors.chineseWhite};
`;

export default List;

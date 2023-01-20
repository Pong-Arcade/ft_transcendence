import React from "react";
import styled from "styled-components";

interface IContext {
  fontSize?: string;
}

const Context = styled.p<IContext>`
  font-size: ${(props) => props.fontSize && props.fontSize};
`;

export default Context;

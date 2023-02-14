import React from "react";
import styled from "styled-components";

const AttributeGroupStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 12%;
  background-color: ${(props) => props.theme.background.front};
  border-radius: ${(props) => props.theme.border.board};
`;

const Attribute = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background.front};
  width: 100%;
  height: 100%;
  font-size: 2rem;
  border-radius: 50%;
`;

interface Props {
  attrList: string[];
}

const AttributeGroup = ({ attrList }: Props) => {
  return (
    <AttributeGroupStyled>
      {attrList.map((attr) => (
        <Attribute key={attr}>{attr}</Attribute>
      ))}
    </AttributeGroupStyled>
  );
};

export default AttributeGroup;

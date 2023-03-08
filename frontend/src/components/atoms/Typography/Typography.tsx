import React from "react";
import styled from "styled-components";

interface Props {
  children?: React.ReactNode;
  fontSize: string;
  fontColor?: string;
}

const TypographyStyled = styled.p<Props>`
  width: 100%;
  text-shadow: -0.1rem 0 ${(props) => props.theme.colors.blueCola},
    0 0.1rem ${(props) => props.theme.colors.blueCola},
    0.1rem 0 ${(props) => props.theme.colors.blueCola},
    0 -0.1rem ${(props) => props.theme.colors.blueCola};
  font-size: ${(props) => props.fontSize || "1rem"};
  color: ${(props) => props.fontColor || "white"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

const Typography = ({ children, ...rest }: Props) => {
  return <TypographyStyled {...rest}>{children}</TypographyStyled>;
};

export default Typography;

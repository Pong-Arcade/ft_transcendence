import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  fontSize: string;
  fontColor?: "primary" | "secondary";
}

const TypographyStyled = styled.p<Props>`
  text-shadow: -0.1rem 0 ${(props) => props.theme.colors.blueCola},
    0 0.1rem ${(props) => props.theme.colors.blueCola},
    0.1rem 0 ${(props) => props.theme.colors.blueCola},
    0 -0.1rem ${(props) => props.theme.colors.blueCola};
  font-size: ${(props) => props.fontSize || "1rem"};
  color: ${(props) =>
    props.fontColor === "secondary"
      ? props.theme.colors.blueCola
      : props.theme.colors.white};
  white-space: nowrap;
  text-decoration: none;
`;

const Typography = ({ children, ...rest }: Props) => {
  return <TypographyStyled {...rest}>{children}</TypographyStyled>;
};

export default Typography;

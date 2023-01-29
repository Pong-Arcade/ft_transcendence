import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

interface Props {
  children: React.ReactNode;
  width?: string;
  height?: string;
}

const ContentListWrapperStyled = styled(Board).attrs((props) => {
  return {
    width: props.width || "100%",
    height: props.height || "72%",
    borderRadius: true,
    boxShadow: false,
    flexDirection: "column",
    justifyContent: "space-around",
  };
})`
  gap: 0.1vh;
`;

const ContentListWrapper = ({ children, ...rest }: Props) => {
  return (
    <ContentListWrapperStyled {...rest}>{children}</ContentListWrapperStyled>
  );
};

export default ContentListWrapper;

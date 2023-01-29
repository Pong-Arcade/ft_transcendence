import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";

interface Props {
  titleList: string[];
  contentList: string[];
}

const ContentStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: props.height,
    borderRadius: true,
    justifyContent: "space-between",
  };
})``;

const ContentTitle = styled(Board).attrs((props) => {
  return {
    width: "20%",
    height: "100%",
    backgroundColor: props.theme.background.front,
    borderRadius: true,
  };
})`
  font-size: 2rem;
`;

const Content = styled(Board).attrs((props) => {
  return {
    width: "79%",
    height: "100%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
  };
})`
  font-size: 2rem;
`;

const ContentList = ({ titleList, contentList }: Props) => {
  const height = `${100 / titleList.length}%`;
  return (
    <>
      {titleList.map((title, idx) => (
        <ContentStyled key={idx} height={height}>
          <ContentTitle key={title}>{title}</ContentTitle>
          <Content key={idx}>{contentList[idx]}</Content>
        </ContentStyled>
      ))}
    </>
  );
};

export default ContentList;

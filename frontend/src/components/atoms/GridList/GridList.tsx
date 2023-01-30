import React from "react";
import styled from "styled-components";

interface Props {
  titleList?: string[];
  contentList?: string[][];
  height: string;
  width: string;
  backgroundColor?: string;
  boxShadow?: boolean;
  borderRadius?: string;
  flexDirection?: "row" | "column";
  justifyContent?: string;
  alignItems?: string;
  blankMessage?: string;
  gap?: string;
  gridTemplate?: string;
  onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const GridListStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  box-shadow: ${(props) => props.boxShadow && props.theme.box.shadow};
  border-radius: ${(props) => props.borderRadius || props.theme.border.board};
  display: flex;
  flex-direction: ${(props) => props.flexDirection || "column"};
  justify-content: ${(props) => props.justifyContent || "center"};
  align-items: ${(props) => props.alignItems || "center"};
  gap: ${(props) => props.gap && props.gap};
  grid-template: ${(props) => props.gridTemplate && props.gridTemplate};
`;

interface GridTitleGroupProps {
  gridTemplateColumns?: string;
}

const GridTitleGroup = styled.div<GridTitleGroupProps>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.gridTemplateColumns && props.gridTemplateColumns};
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  height: 12%;
  background-color: ${(props) => props.theme.background.front};
  border-radius: ${(props) => props.theme.border.board};
`;

const GridTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background.front};
  width: 100%;
  height: 100%;
  font-size: 2rem;
  border-radius: 50%;
`;

interface GridContentGroupProps {
  gridTemplateColumns?: string;
}

const GridContentGroup = styled.div<GridContentGroupProps>`
  display: grid;
  width: 100%;
  height: 90%;
  grid-template-columns: ${(props) =>
    props.gridTemplateColumns && props.gridTemplateColumns};
  background-color: ${(props) => props.theme.background.middle};
  border-radius: ${(props) => props.theme.border.board};
`;

const GridContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background.middle};
  width: 100%;
  height: 100%;
  font-size: 2rem;
  border-radius: ${(props) => props.theme.border.board};
`;

const GridList = ({ titleList, contentList, ...rest }: Props) => {
  if (!titleList || !contentList) return null;
  const gridTemplateColumns = `repeat(${titleList.length}, 1fr)`;
  return (
    <GridListStyled {...rest}>
      <GridTitleGroup gridTemplateColumns={gridTemplateColumns}>
        {titleList.map((title) => (
          <GridTitle key={title}>{title}</GridTitle>
        ))}
      </GridTitleGroup>
      <GridContentGroup gridTemplateColumns={gridTemplateColumns}>
        {contentList.map((content) =>
          content.map((item, idx) => (
            <GridContent key={idx}>{item}</GridContent>
          ))
        )}
      </GridContentGroup>
    </GridListStyled>
  );
};

export default GridList;

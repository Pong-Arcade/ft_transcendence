import React from "react";
import styled, { css } from "styled-components";

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
  isStat?: boolean;
  rowCount?: number;
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
  grid-template-columns: ${(props) =>
    props.gridTemplateColumns || "repeat(5, 1fr)"};
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
  gridTemplateRows?: string;
  fullList?: boolean;
}

const GridContentGroup = styled.div<GridContentGroupProps>`
  display: grid;
  width: 100%;
  height: 90%;
  grid-template-columns: ${(props) =>
    props.gridTemplateColumns && props.gridTemplateColumns};
  grid-template-rows: ${(props) =>
    props.gridTemplateRows && props.gridTemplateRows};
  background-color: ${(props) => props.theme.background.middle};
  border-radius: ${(props) => props.theme.border.board};
  text-align: center;
`;

interface GridContentProps {
  isStat?: boolean;
  win?: boolean;
}

const GridContent = styled.div<GridContentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background.middle};
  width: 100%;
  height: 100%;
  font-size: 2rem;
  border-radius: ${(props) => props.theme.border.board};

  ${(props) =>
    props.isStat &&
    (props.win
      ? css`
          color: #05f87f;
        `
      : css`
          color: #f7f300;
        `)}
`;

const GridList = ({
  titleList,
  contentList,
  rowCount,
  isStat,
  ...rest
}: Props) => {
  if (!titleList || !contentList) return null;

  const gridTemplateColumns = `repeat(${titleList.length}, 1fr)`;
  const gridTemplateRows = `repeat(${rowCount || contentList.length}, 1fr)`;

  return (
    <GridListStyled {...rest}>
      <GridTitleGroup gridTemplateColumns={gridTemplateColumns}>
        {titleList.map((title) => (
          <GridTitle key={title}>{title}</GridTitle>
        ))}
      </GridTitleGroup>
      <GridContentGroup
        gridTemplateRows={gridTemplateRows}
        gridTemplateColumns={gridTemplateColumns}
      >
        {contentList.map((content) =>
          content.map((item, idx) =>
            isStat ? (
              <GridContent isStat win={content[0] === "승"} key={idx}>
                {item}
              </GridContent>
            ) : (
              <GridContent key={idx}>{item}</GridContent>
            )
          )
        )}
      </GridContentGroup>
    </GridListStyled>
  );
};

export default GridList;

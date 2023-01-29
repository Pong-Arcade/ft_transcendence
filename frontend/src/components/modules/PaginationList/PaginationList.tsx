import React from "react";
import styled from "styled-components";
import List from "../../atoms/List";
import PaginationButton from "../../atoms/PaginationButton";
import ButtonGroup from "../ButtonGroup";

interface Props {
  list?: React.ReactNode[];
  width: string;
  height: string;
  backgroundColor?: string;
  blankMessage?: string;
  display?: string;
  gridTemplate?: string;
  pageLength?: number;
  flexDirection?: "row" | "column";
  onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PaginationListStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.backgroundColor
      ? props.backgroundColor
      : props.theme.background.middle};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: ${(props) => props.theme.border.board};
  display: ${(props) => props.display || "flex"};
`;

const PaginationList = ({
  list,
  display,
  gridTemplate,
  pageLength,
  flexDirection,
  onOpen,
  ...rest
}: Props) => {
  return (
    <PaginationListStyled {...rest}>
      <List
        blankMessage="blank"
        list={pageLength ? list?.slice(0, pageLength) : list?.slice(0, 5)}
        width="98%"
        height="85%"
        flexDirection={flexDirection}
        justifyContent="start"
        gap="0.2rem"
        display={display}
        gridTemplate={gridTemplate}
        onOpen={onOpen}
      />
      <ButtonGroup width="18vw" height="9%" justifyContent="space-between">
        <PaginationButton
          direction="left"
          height="4vh"
          width="8vw"
          fontSize="1.5rem"
        />
        <PaginationButton
          direction="right"
          height="4vh"
          width="8vw"
          fontSize="1.5rem"
        />
      </ButtonGroup>
    </PaginationListStyled>
  );
};

export default PaginationList;

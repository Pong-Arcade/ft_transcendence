import React from "react";
import styled from "styled-components";
import ListItem from "../ListItem";

// TODO: list type 정의
interface Props {
  list?: React.ReactNode[];
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
  display?: string;
  gridTemplate?: string;
  onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ListStyled = styled.div<Props>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  box-shadow: ${(props) => props.boxShadow && props.theme.box.shadow};
  border-radius: ${(props) => props.borderRadius || props.theme.border.board};
  display: ${(props) => props.display || "flex"};
  flex-direction: ${(props) => props.flexDirection || "row"};
  justify-content: ${(props) => props.justifyContent || "center"};
  align-items: ${(props) => props.alignItems || "center"};
  gap: ${(props) => props.gap && props.gap};
  grid-template: ${(props) => props.gridTemplate && props.gridTemplate};
`;

const List = ({ list, blankMessage, onOpen, ...rest }: Props) => {
  if (!list) return null;

  if (list.length === 0) {
    return <ListStyled {...rest}>{blankMessage}</ListStyled>;
  }
  return (
    <ListStyled {...rest}>
      {list.map((item, index) => {
        return (
          <ListItem key={index} onOpen={onOpen}>
            {item}
          </ListItem>
        );
      })}
    </ListStyled>
  );
};

export default List;

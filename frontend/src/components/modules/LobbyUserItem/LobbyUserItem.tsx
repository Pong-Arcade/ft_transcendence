import { MouseEvent } from "react";
import styled from "styled-components";
import Button from "../../atoms/Button";

export interface IItem {
  userId?: string;
  nickname?: string;
  avatarUrl?: string;
  email?: string;
}

export interface IPaginationItem {
  item: IItem;
  subList?: string[];
  onItemClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const LobbyUserItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.front,
  };
})``;

const LobbyUserItem = ({
  item: { nickname },
  onItemClick,
}: IPaginationItem) => {
  return (
    <LobbyUserItemStyled onClick={onItemClick}>{nickname}</LobbyUserItemStyled>
  );
};

export default LobbyUserItem;

import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import PaginationList from "../PaginationList";

const LobbyChatRoomListStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "45%",
    backgroundColor: props.theme.background.middle,
    flexDirection: "column",
    justifyContent: "space-evenly",
    borderRadius: true,
  };
})``;

const LobbyChatRoomList = () => {
  return (
    <LobbyChatRoomListStyled>
      <PaginationList
        list={["1", "2", "3", "4", "5", "6"]}
        width="90%"
        height="100%"
        display="grid"
        gridTemplate="repeat(3, 1fr) / repeat(2, 1fr)"
        pageLength={6}
      />
    </LobbyChatRoomListStyled>
  );
};

export default LobbyChatRoomList;

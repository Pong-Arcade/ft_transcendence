import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/ui/boards/Board";

const RootStyled = styled(Board)`
  width: 95%;
  height: 95%;
  box-shadow: rgba(255, 255, 255, 0.2) 0px 5px 15px;
  background-color: ${(props) => props.theme.colors.chineseWhite};
`;

// TODO: 로그인 처리
// 로그인 하지 않은 사용자 => <Login/>으로 redirect
// 로그인 한 사용자 => <Login/>으로 접속시 <Lobby/>로 redirect
const Root = () => {
  return (
    <RootStyled>
      <Outlet />
    </RootStyled>
  );
};

export default Root;

import { Outlet } from "react-router-dom";
import styled from "styled-components";

const RootStyled = styled.div`
  background-color: ${(props) => props.theme.colors.chineseWhite};
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Root = () => {
  return (
    <RootStyled>
      <Outlet />
    </RootStyled>
  );
};

export default Root;

import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import ModalWrapper from "../components/atoms/ModalWrapper";
import Spinner from "../components/atoms/Spinner";
import { loadingState } from "../state/LoadingState";

const RootStyled = styled.div`
  background-color: ${(props) => props.theme.colors.chineseWhite};
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Root = () => {
  const isLoading = useRecoilValue(loadingState);

  return (
    <RootStyled>
      <Outlet />
      {isLoading && (
        <ModalWrapper>
          <Spinner />
        </ModalWrapper>
      )}
    </RootStyled>
  );
};

export default Root;

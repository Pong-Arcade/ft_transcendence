import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import GlobalErrorModal from "../components/modules/GlobalErrorModal";
import errorState from "../state/ErrorState";

const RootStyled = styled.div`
  background-color: ${(props) => props.theme.colors.chineseWhite};
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Root = () => {
  const error = useRecoilValue(errorState);

  return (
    <>
      <RootStyled>
        <Outlet />
      </RootStyled>
      {error.isError && <GlobalErrorModal errors={error}></GlobalErrorModal>}
    </>
  );
};

export default Root;

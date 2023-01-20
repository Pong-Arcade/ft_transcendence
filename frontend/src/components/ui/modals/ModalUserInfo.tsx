import Avatar from "@mui/material/Avatar";
import React from "react";
import styled from "styled-components";
import Board from "../boards/Board";
import Button from "../buttons/Button";
import ButtonGroup from "../buttons/ButtonGroup";
import Context from "../lists/Context";
import ContextList from "../lists/ContextList";
import Modal from "./Modal";
import ModalContainer from "./ModalContainer";
import ModalTitle from "./ModalTitle";

const ModalUserInfoStyled = styled(Modal)`
  width: 50%;
  height: 90%;
  justify-content: space-between;
`;

const Main = styled(Board)`
  height: 80%;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: none;
`;

const UserInfo = styled(Board)`
  height: 45%;
  width: 95%;
  justify-content: space-between;
  box-shadow: none;
`;
const UserGameInfo = styled(Board)`
  height: 53%;
  width: 95%;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: none;
  background-color: ${(props) => props.theme.background.middle};
`;

const UserLadderInfo = styled(Board)`
  box-shadow: none;

  width: 100%;
  height: 45%;
  background-color: ${(props) => props.theme.background.middle};
`;
const UserCurrentState = styled(Board)`
  box-shadow: none;

  width: 100%;
  height: 30%;
  background-color: ${(props) => props.theme.background.middle};
`;

const UserButtonGroup = styled(Board)`
  background-color: ${(props) => props.theme.background.middle};
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 20%;
  box-shadow: none;
`;

const Footer = styled(Board)`
  width: 100%;
  height: 8%;
  box-shadow: none;
`;

interface IModalUserInfo {
  setOpenUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalUserInfo = ({ setOpenUserInfo }: IModalUserInfo) => {
  return (
    <ModalUserInfoStyled>
      <ModalTitle
        title="UserName"
        setOpenModal={setOpenUserInfo}
        titleFontSize="2rem"
        height="10%"
      />
      <Main>
        <UserInfo>
          <Avatar sx={{ width: "30%", height: "70%", marginTop: "1vh" }} />
          <ContextList width="60%" height="95%" gap="0.5vh">
            <Context fontSize="2rem">이름 kangkim</Context>
            <Context fontSize="2rem">가입일 yyyy-mm-dd</Context>
            <Context fontSize="2rem">자기소개</Context>
          </ContextList>
        </UserInfo>
        <UserGameInfo>
          <UserLadderInfo>레더정보</UserLadderInfo>
          <UserCurrentState>현재상태</UserCurrentState>
          <UserButtonGroup>
            <Button width="12vw" height="6vh" fontSize="1.5rem">
              친구추가
            </Button>
            <Button width="12vw" height="6vh" fontSize="1.5rem">
              관전하기
            </Button>
          </UserButtonGroup>
        </UserGameInfo>
      </Main>
      <Footer>
        <Button
          onClick={() => {
            setOpenUserInfo(false);
          }}
          width="12vw"
          height="6vh"
          fontSize="1.5rem"
        >
          닫기
        </Button>
      </Footer>
    </ModalUserInfoStyled>
  );
};

export default ModalUserInfo;

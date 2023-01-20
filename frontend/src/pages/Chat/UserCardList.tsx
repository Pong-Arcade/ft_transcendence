import React, { useState } from "react";
import { Avatar } from "@mui/material";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import ModalContainer from "../../components/ui/modals/ModalContainer";
import SubModal from "../../components/ui/modals/SubModal";
import SubModalButtonGroup from "../../components/ui/modals/SubModalGroup";
import SubModalButton from "../../components/ui/modals/SubModalButton";

const UserCardListStyled = styled(Board)`
  background-color: ${(props) => props.theme.background.middle};
  width: 100%;
  height: 35%;
  justify-content: start;
  padding: 1vh 2vh;
  gap: 1vh;
  overflow-x: auto;
`;

let userList: string[] = [
  "kangkim",
  "kangkim2",
  "kangkim3",
  "kangkim4",
  "kangkim5",
  "kangkim6",
  "kangkim7",
  "kangkim7",
  "kangkim7",
];

const UserCard = styled(Board)`
  background-color: ${(props) => props.theme.background.back};
  height: 95%;
  min-width: 12vw;
  padding: 2vh;
  flex-direction: column;
  justify-content: start;
  gap: 2vh;
  cursor: pointer;
`;

const Name = styled(Board)`
  width: 100%;
  height: 50%;
  font-size: 1.5vw;
  background-color: ${(props) => props.theme.background.middle};
`;

const UserCardList = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const subModalList = [
    "정보보기",
    "강퇴하기",
    "채팅금지",
    "관리자부여",
    "게임신청",
  ];

  const handleOpenModal = (e: React.MouseEvent<HTMLDivElement>) => {
    setPositionX(e.clientX);
    setPositionY(e.clientY);
    setOpenModal(true);
  };

  return (
    <UserCardListStyled>
      {userList.map((elem, idx) => (
        <UserCard key={idx} onClick={handleOpenModal}>
          <Avatar sx={{ width: "8vw", height: "8vw" }} />
          <Name>{elem}</Name>
        </UserCard>
      ))}
      {isOpenModal && (
        <ModalContainer
          backgroundColor="null"
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setOpenModal(false);
            }
          }}
        >
          <SubModal top={positionY} left={positionX} width="8%" height="19%">
            <SubModalButtonGroup>
              {subModalList.map((elem, idx) => (
                <SubModalButton
                  key={idx}
                  width="100%"
                  height="20%"
                  fontSize="1.5rem"
                >
                  {elem}
                </SubModalButton>
              ))}
            </SubModalButtonGroup>
          </SubModal>
        </ModalContainer>
      )}
    </UserCardListStyled>
  );
};

export default UserCardList;

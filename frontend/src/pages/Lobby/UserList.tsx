import React, { useState } from "react";
import styled from "styled-components";
import List from "../../components/ui/lists/List";
import ListElement from "../../components/ui/lists/ListElement";
import ModalContainer from "../../components/ui/modals/ModalContainer";
import ModalUserInfo from "../../components/ui/modals/ModalUserInfo";
import SubModal from "../../components/ui/modals/SubModal";
import SubModalButton from "../../components/ui/modals/SubModalButton";
import SubModalButtonGroup from "../../components/ui/modals/SubModalGroup";

const UserListStyled = styled(List)`
  height: 89%;
`;
const User = styled(ListElement)``;

let Users: string[] = [];
for (let i = 0; i < 5; ++i) {
  Users.push("----- test user name overflow -----");
}

const UserList = () => {
  const [isOpenSubModal, setOpenSubModal] = useState(false);
  const [isOpenUserInfo, setOpenUserInfo] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const subModalList = ["귓속말", "친구추가", "차단하기"];

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPositionX(e.clientX);
    setPositionY(e.clientY);
    setOpenSubModal(true);
  };
  return (
    <UserListStyled>
      {Users.map((elem, idx) => (
        <User onClick={handleOpenModal} key={idx}>
          {elem}
        </User>
      ))}
      {isOpenSubModal && (
        <ModalContainer
          backgroundColor="null"
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setOpenSubModal(false);
            }
          }}
        >
          <SubModal top={positionY} left={positionX} width="8%" height="13%">
            <SubModalButtonGroup>
              <SubModalButton
                onClick={() => {
                  setOpenUserInfo(true);
                  setOpenSubModal(false);
                }}
                width="100%"
                height="25%"
                fontSize="1.5rem"
              >
                정보보기
              </SubModalButton>
              {subModalList.map((elem, idx) => (
                <SubModalButton
                  key={idx}
                  width="100%"
                  height="25%"
                  fontSize="1.5rem"
                >
                  {elem}
                </SubModalButton>
              ))}
            </SubModalButtonGroup>
          </SubModal>
        </ModalContainer>
      )}
      {isOpenUserInfo && (
        <ModalContainer
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setOpenUserInfo(false);
            }
          }}
        >
          <ModalUserInfo setOpenUserInfo={setOpenUserInfo} />
        </ModalContainer>
      )}
    </UserListStyled>
  );
};

export default UserList;

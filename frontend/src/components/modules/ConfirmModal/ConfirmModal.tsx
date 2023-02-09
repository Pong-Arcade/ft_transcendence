import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ModalTitle from "../ModalTitle";

export enum EConfirmType {
  LOGOUT = "Logout",
  EXIT = "Exit",
  INVITE = "Invite",
}

interface Props {
  onClose?: () => void;
  onYesConfirm?: () => void;
  onNoConfirm?: () => void;
  type: EConfirmType;
  content?: string | number;
}

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "79%",
  borderRadius: true,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
})`
  background-color: ${(props) => props.theme.background.middle};
`;

const ConfirmModal = ({
  onClose,
  type,
  onYesConfirm,
  onNoConfirm,
  content,
}: Props) => {
  if (type === EConfirmType.INVITE) {
    return (
      <ModalWrapper>
        <Modal width="30%" height="30%">
          <ModalTitle onClose={onClose} fontSize="3rem" height="20%">
            초대하기
          </ModalTitle>
          <Wrapper>
            <Typography fontSize="2.8rem">
              {content || 0} 명을 초대했습니다.
            </Typography>
            <ButtonGroup width="100%" height="30%">
              <Button width="45%" height="100%" onClick={onYesConfirm}>
                닫기
              </Button>
            </ButtonGroup>
          </Wrapper>
        </Modal>
      </ModalWrapper>
    );
  }
  return (
    <ModalWrapper>
      <Modal width="30%" height="30%">
        <ModalTitle onClose={onClose} fontSize="3rem" height="20%">
          {type === EConfirmType.LOGOUT ? "로그아웃" : "나가기"}
        </ModalTitle>
        <Wrapper>
          <Typography fontSize="2.8rem">
            {type === EConfirmType.LOGOUT
              ? "정말 로그아웃 하시겠습니까?"
              : "정말 방을 나가시겠습니까?"}
          </Typography>
          <ButtonGroup width="100%" height="30%">
            <Button width="45%" height="100%" onClick={onYesConfirm}>
              예
            </Button>
            <Button width="45%" height="100%" onClick={onNoConfirm}>
              아니오
            </Button>
          </ButtonGroup>
        </Wrapper>
      </Modal>
    </ModalWrapper>
  );
};

export default ConfirmModal;

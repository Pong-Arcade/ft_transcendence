import React from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import Typography from "../../atoms/Typography";
import ButtonGroup from "../ButtonGroup";
import ModalTitle from "../ModalTitle";

export enum EConfirmType {
  LOGOUT = "Logout",
  EXIT = "Exit",
}

interface Props {
  width: string;
  height: string;
  onClose?: () => void;
  onYesConfirm?: () => void;
  onNoConfirm?: () => void;
  type: EConfirmType;
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
  width,
  height,
  onClose,
  type,
  onYesConfirm,
  onNoConfirm,
}: Props) => {
  return (
    <>
      <Modal width={width} height={height}>
        {type === EConfirmType.LOGOUT ? (
          <>
            <ModalTitle onClose={onClose} fontSize="3rem" height="20%">
              로그아웃
            </ModalTitle>
            <Wrapper>
              <Typography fontSize="2.8rem">
                정말 로그아웃 하시겠습니까?
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
          </>
        ) : (
          <>
            <ModalTitle onClose={onClose} fontSize="3rem" height="20%">
              나가기
            </ModalTitle>
            <Wrapper>
              <Typography fontSize="2.8rem">
                정말 방을 나가시겠습니까?
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
          </>
        )}
      </Modal>
    </>
  );
};

export default ConfirmModal;

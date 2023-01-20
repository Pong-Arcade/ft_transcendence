import React from "react";
import styled from "styled-components";
import Context from "../../components/ui/lists/Context";
import ContextList from "../../components/ui/lists/ContextList";
import Loading from "../../components/ui/loading/Loading";
import Modal from "../../components/ui/modals/Modal";
import ModalTitle from "../../components/ui/modals/ModalTitle";

const QuickGameModalStyled = styled(Modal)`
  width: 40%;
  height: 30%;
  justify-content: space-between;
`;

interface IQuickGameModal {
  title: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  titleFontSize: string;
}

const QuickGameModal = ({
  title,
  setOpenModal,
  titleFontSize,
}: IQuickGameModal) => {
  return (
    <QuickGameModalStyled>
      <ModalTitle
        title={title}
        setOpenModal={setOpenModal}
        titleFontSize={titleFontSize}
      />
      <ContextList width="100%" height="79%" gap="6vh">
        <Context fontSize="3rem">매칭 상대를 찾고 있습니다</Context>
        <Loading />
      </ContextList>
    </QuickGameModalStyled>
  );
};

export default QuickGameModal;

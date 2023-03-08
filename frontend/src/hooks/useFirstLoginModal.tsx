import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useModal from "./useModal";

const LoginQueryKey = "isFirstLogin";

const useFirstLoginModal = () => {
  const navigate = useNavigate();

  const {
    isModalOpen: isFirstLoginModal,
    onModalOpen: FirstLoginModalOpen,
    onModalClose: FirstLoginModalClose,
    onSubmit: FirstLoginModalSubmit,
  } = useModal({
    afterClose: () => {
      navigate("/lobby");
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get(LoginQueryKey) === "true") {
      FirstLoginModalOpen();
    }
  }, []);

  return {
    isFirstLoginModal,
    FirstLoginModalClose,
    FirstLoginModalSubmit,
  };
};

export default useFirstLoginModal;

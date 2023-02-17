import { useEffect } from "react";
import useModal from "./useModal";

const LoginQueryKey = "isFirstLogin";

const useFirstLoginModal = () => {
  const {
    isModalOpen: isFirstLoginModal,
    onModalOpen: FirstLoginModalOpen,
    onModalClose: FirstLoginModalClose,
    onSubmit: FirstLoginModalSubmit,
  } = useModal({});

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

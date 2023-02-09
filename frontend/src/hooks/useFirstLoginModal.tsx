import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LoginQueryKey = "isFirstLogin";

const useFirstLoginModal = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get(LoginQueryKey) === "true") {
      setIsFirstLogin(true);
    }
  }, []);

  const onClose = () => {
    setIsFirstLogin(false);
  };
  const onSubmit = () => {
    setIsFirstLogin(false);
  };

  return {
    isFirstLogin,
    onSubmit,
    onClose,
  };
};

export default useFirstLoginModal;

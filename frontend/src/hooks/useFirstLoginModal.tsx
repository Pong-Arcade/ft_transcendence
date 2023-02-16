import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loginState } from "../state/LoginState";

const LoginQueryKey = "isFirstLogin";

const useFirstLoginModal = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const setLogin = useSetRecoilState(loginState);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get(LoginQueryKey) === "true") {
      setIsFirstLogin(true);
    }
    setLogin(true);
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

import { Dispatch, SetStateAction } from "react";
import { Location } from "react-router-dom";

export const login = (setIsLoading: Dispatch<SetStateAction<boolean>>) => {
  setIsLoading(true);
  window.location.replace(`${import.meta.env.VITE_API_URL}/api/auth/login`);
};

const LoginQueryKey = "isFirstLogin";

interface IFirstLogin {
  location: Location;
  setIsFirstLogin: Dispatch<SetStateAction<boolean>>;
}

export const firstLogin = ({ location, setIsFirstLogin }: IFirstLogin) => {
  const searchParams = new URLSearchParams(location.search);

  if (searchParams.get(LoginQueryKey) === "true") {
    setIsFirstLogin(true);
  }
};

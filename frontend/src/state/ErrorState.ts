import { atom } from "recoil";

interface IErrorState {
  isError: boolean;
  error: any;
}

const errorState = atom<IErrorState>({
  key: "errorState",
  default: {
    isError: false,
    error: "",
  },
});

export default errorState;

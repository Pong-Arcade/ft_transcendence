import { atom } from "recoil";

export interface IErrorState {
  isError: boolean;
  error: any;
  isChangePage?: boolean;
}

const errorState = atom<IErrorState>({
  key: "errorState",
  default: {
    isError: false,
    error: "",
    isChangePage: false,
  },
});

export default errorState;

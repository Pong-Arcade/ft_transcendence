import { useState } from "react";

interface Props {
  openAfter?: () => void;
  closeAfter?: () => void;
}

const useUserInfo = ({ openAfter, closeAfter }: Props) => {
  const [isOpenUserInfo, setOpenUserInfo] = useState(false);

  const onOpenMenuDetail = () => {
    setOpenUserInfo(true);
    openAfter?.();
  };
  const onCloseMenuDetail = () => {
    setOpenUserInfo(false);
    closeAfter?.();
  };

  return { isOpenUserInfo, onOpenMenuDetail, onCloseMenuDetail };
};

export default useUserInfo;

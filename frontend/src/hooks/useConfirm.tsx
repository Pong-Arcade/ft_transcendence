import { useState } from "react";

const useConfirm = () => {
  const [isOpenConfirm, setOpenConfirm] = useState(false);

  const onOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const onCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return {
    isOpenConfirm,
    onOpenConfirm,
    onCloseConfirm,
  };
};

export default useConfirm;

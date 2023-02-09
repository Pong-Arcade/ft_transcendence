import { useState } from "react";

const useInfoSetting = () => {
  const [isOpenInfoSetting, setIsInfoSetting] = useState(false);

  const onOpenInfoSetting = () => {
    setIsInfoSetting(true);
  };

  const onCloseInfoSetting = () => {
    setIsInfoSetting(false);
  };

  return {
    isOpenInfoSetting,
    onOpenInfoSetting,
    onCloseInfoSetting,
  };
};

export default useInfoSetting;

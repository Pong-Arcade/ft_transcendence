import { useState } from "react";

const useInfoSetting = () => {
  const [onInfoSetting, setOnInfoSetting] = useState(false);

  const onOpenInfoSetting = () => {
    setOnInfoSetting(true);
  };

  const onCloseInfoSetting = () => {
    setOnInfoSetting(false);
  };

  return {
    onInfoSetting,
    onOpenInfoSetting,
    onCloseInfoSetting,
  };
};

export default useInfoSetting;

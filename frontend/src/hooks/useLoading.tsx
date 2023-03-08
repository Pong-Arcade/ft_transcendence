import { useState } from "react";

interface Props {
  initialLoading?: boolean;
  afterStartLoading?: () => void;
  afterEndLoading?: () => void;
}

const useLoading = ({
  initialLoading = false,
  afterStartLoading,
  afterEndLoading,
}: Props) => {
  const [isLoading, setLoading] = useState(initialLoading);

  const startLoading = () => {
    setLoading(true);
    afterStartLoading?.();
  };
  const endLoading = () => {
    setLoading(false);
    afterEndLoading?.();
  };

  return { isLoading, startLoading, endLoading };
};

export default useLoading;

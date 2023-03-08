import ModalWrapper from "../../atoms/ModalWrapper";
import Typography from "../../atoms/Typography";

interface Props {
  timeLimit: number;
}
const GameCountDown = ({ timeLimit }: Props) => {
  if (timeLimit === 0) return null;
  return (
    <ModalWrapper backgroundColor="none">
      <Typography fontSize="10rem">{timeLimit}</Typography>
    </ModalWrapper>
  );
};

export default GameCountDown;

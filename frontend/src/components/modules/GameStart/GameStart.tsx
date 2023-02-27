import React, { useRef } from "react";
import styled from "styled-components";
import ModalWrapper from "../../atoms/ModalWrapper";

const GameStartTitle = styled.p`
  position: absolute;
  font-size: 10rem;

  @keyframes fadeOut {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  animation: fadeOut 2s linear forwards;
`;

const CountDown = styled.p`
  @keyframes countdown {
    0% {
      opacity: 1;
    }
    33% {
      counter-increment: my-count -1;
      opacity: 1;
    }
    66% {
      counter-increment: my-count -2;
      opacity: 1;
    }
    100% {
      counter-increment: my-count -3;
      opacity: 1;
    }
  }
  opacity: 0;
  position: absolute;
  counter-reset: my-count 3;
  animation: countdown 3s linear forwards;
  animation-delay: 2s;
  &::after {
    content: counter(my-count);
    font-size: 10rem;
  }
`;

const GameStartStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const GameStart = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const TIME_LIMIT = 5500;
  //
  setTimeout(() => {
    if (divRef.current) {
      divRef.current.style.display = "none";
    }
  }, TIME_LIMIT);

  return (
    <GameStartStyled ref={divRef}>
      <ModalWrapper backgroundColor="none">
        <GameStartTitle>게임을 시작합니다</GameStartTitle>
        <CountDown></CountDown>
      </ModalWrapper>
    </GameStartStyled>
  );
};

export default GameStart;

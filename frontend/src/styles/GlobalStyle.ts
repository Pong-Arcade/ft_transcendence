import React from 'react';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    box-sizing: border-box;
  }

  #root {
    font-family: 'Sofia Sans', sans-serif;
    background-color: ${(props) => props.theme.colors.chineseWhite};
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    border: thin solid rgba(0, 0, 0, 0.1);
    color: ${(props) => props.theme.font.cultured};
    border-radius: ${(props) => props.theme.border.board};
    cursor: pointer;
    &:hover {
      box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
    }
  }
`;

export default GlobalStyle;
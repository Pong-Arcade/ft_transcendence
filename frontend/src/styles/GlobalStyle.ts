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
`;

export default GlobalStyle;
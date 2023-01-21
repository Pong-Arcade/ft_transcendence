import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    font-family: 'Jua', sans-serif !important;
    font-family: 'Sofia Sans', sans-serif;
    box-sizing: border-box;
    text-shadow: -0.1rem 0 ${(props) => props.theme.colors.blueCola},
    0 0.1rem ${(props) => props.theme.colors.blueCola},
    0.1rem 0 ${(props) => props.theme.colors.blueCola},
    0 -0.1rem ${(props) => props.theme.colors.blueCola};
    color: ${(props) => props.theme.colors.white};
    white-space: nowrap;
    text-decoration: none;
  }

  input {
    border: none;
    outline: none;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  #root {
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
    font-family: inherit;

    &:hover {
      box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
    }
  }
`;

export default GlobalStyle;

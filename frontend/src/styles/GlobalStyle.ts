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
    text-decoration: none;
  }

  #root {
    font-size: 16px;
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
`;

export default GlobalStyle;

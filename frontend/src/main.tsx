import React from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <div>Hello</div>
    </>
  );
}

export default App;

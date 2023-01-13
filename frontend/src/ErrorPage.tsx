import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

// TODO: Error page css
// TODO: redirect button to (home or login) or previous page
const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText}</i>
        </p>
      </div>
    );
  } else {
    return <h1>Oops!</h1>;
  }
};

export default ErrorPage;

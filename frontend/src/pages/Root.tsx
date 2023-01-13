import React, { useEffect, useState } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";

const Root = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div>
      <h1>Root file</h1>
      {/* <Outlet context={[isLogin, setIsLogin]} /> */}
      <Outlet />
    </div>
  );
};

export default Root;

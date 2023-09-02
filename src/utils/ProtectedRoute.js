import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((state) => state.user.user?.userDetails?.nat);

  if (auth) {
    return auth ? <Component {...rest} /> : <Navigate to="/unauthorized" />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const loginSuccess = useSelector((state) => state.account.loginSuccess);
  return loginSuccess ? children : <Navigate to="/" />;
};

export default PrivateRoute;

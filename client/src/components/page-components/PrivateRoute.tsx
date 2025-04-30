import { useAppSelector } from "@/hooks/redux-hooks";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useAppSelector((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;

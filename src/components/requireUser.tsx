import { setCurrentUser, setToken } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { User } from "@/types/generated";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";

interface JwtToken {
  authorities: string;
  exp: number;
  iat: number;
  sub: string;
  username: string;
}

const RequireUser = ({ requiredAutorities }: { requiredAutorities: string[] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentUser, token } = useAppSelector((state) => state.authState);

  useEffect(() => {
    const logout = async () => {
      dispatch(setCurrentUser(null));
      dispatch(setToken(null));
      navigate("/logout");
    };

    if (token) {
      const decodedJwt: JwtToken = jwtDecode(token);
      if (!(decodedJwt && decodedJwt.exp * 1000 >= new Date().getTime())) {
        logout().catch(console.error);
      }
    }
  }, [token, dispatch, navigate]);

  const hasRights = (user: User) => {
    return requiredAutorities.some(
      (value) => user.role.authorities.some((authority) => authority.name === value) || user.role.name === value,
    );
  };

  if (currentUser && hasRights(currentUser)) {
    return <Outlet />;
  }

  if (currentUser) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireUser;

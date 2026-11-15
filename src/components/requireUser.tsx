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
    if (!token) {
      return;
    }

    let tokenIsValid = false;
    try {
      const decodedJwt = jwtDecode<JwtToken>(token);
      tokenIsValid = decodedJwt.exp * 1000 >= Date.now();
    } catch {
      tokenIsValid = false;
    }

    if (!tokenIsValid) {
      dispatch(setCurrentUser(null));
      dispatch(setToken(null));
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [token, dispatch, location, navigate]);

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

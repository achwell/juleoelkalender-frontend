import { setCurrentUser, setToken } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { store } from "@/redux/store";
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

    const { currentUser, token } = store.getState().authState;

    useEffect(() => {
        const logout = async () => {
            dispatch(setCurrentUser(null));
            dispatch(setToken(null));
            navigate("/logout");
        };

        if (token) {
            const decodedJwt: JwtToken = jwtDecode(token);
            if (!(decodedJwt && decodedJwt.exp * 1000 >= Date.now())) {
                logout().catch(console.error);
            }
        }
    }, [token]);

    const hasRights = (user: User) => {
        return requiredAutorities.filter((value) =>
            user.role.authorities.map((authority) => authority.name).includes(value)
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

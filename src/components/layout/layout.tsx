import CurrentCalendarTokenChooser from "@/components/CurrentCalendarTokenChooser";
import Navigation from "@/components/layout/Navigation";
import { useRefreshQuery } from "@/redux/api/refreshApi";
import { setCurrentUser, setToken } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";

const Layout = () => {
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.authState);
    const { data, isFetching, isSuccess, isError, refetch } = useRefreshQuery("", { skip: !currentUser || isMobile });
    const navigate = useNavigate();

    useEffect(() => {
        if (!isFetching && isError) {
            navigate("/login");
        }
    }, [isFetching, isError]);

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 1800000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isFetching && isSuccess && data) {
            dispatch(setCurrentUser(data.user));
            dispatch(setToken(data.token));
        }
    }, [isFetching, isSuccess, data]);

    return (
        <div>
            {currentUser && <Navigation currentUser={currentUser} />}
            <ToastContainer />
            {currentUser && currentUser.calendarToken && currentUser.calendarToken.length > 1 && (
                <CurrentCalendarTokenChooser currentUser={currentUser} />
            )}
            <div className="my-12 mx-3 flex flex-col justify-center items-center w-[100vw]">
                <div className="w-screen">
                    <div className="flex flex-col items-center justify-items-center">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;

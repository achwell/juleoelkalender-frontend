import CurrentCalendarTokenChooser from "@/components/CurrentCalendarTokenChooser";
import Navigation from "@/components/layout/Navigation";
import { useRefreshQuery } from "@/redux/api/refreshApi";
import { setCurrentUser, setToken } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Suspense, useEffect } from "react";
import FullScreenLoader from "@/components/FullScreenLoader";
import { isMobile } from "react-device-detect";
import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.authState);
  const { data, isFetching, isSuccess, isError } = useRefreshQuery("", {
    skip: !currentUser || isMobile,
    pollingInterval: 1800000,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetching && isError) {
      navigate("/login");
    }
  }, [isFetching, isError, navigate]);

  useEffect(() => {
    if (!isFetching && isSuccess && data) {
      dispatch(setCurrentUser(data.user));
      dispatch(setToken(data.token));
    }
  }, [isFetching, isSuccess, data, dispatch]);

  return (
    <div>
      {currentUser && <Navigation currentUser={currentUser} />}
      <ToastContainer />
      {currentUser?.calendarToken && currentUser.calendarToken.length > 1 && (
        <CurrentCalendarTokenChooser currentUser={currentUser} />
      )}
      <div className="my-12 mx-3 flex flex-col justify-center items-center w-screen">
        <div className="w-screen">
          <div className="flex flex-col items-center justify-items-center">
            <Suspense fallback={<FullScreenLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

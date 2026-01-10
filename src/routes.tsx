import FullScreenLoader from "@/components/FullScreenLoader";
import Layout from "@/components/layout/layout";
import RequireUser from "@/components/requireUser";
import AddTokenPage from "@/pages/addtoken.page";
import BeerDetailsPage from "@/pages/beers/details.page";
import EditBeerPage from "@/pages/beers/edit.page";
import BeerPage from "@/pages/beers/index.page";
import BeerReviewsPage from "@/pages/beers/review.page";
import CalendarReviewPage from "@/pages/calendar/calendar.review.page";
import CalendarsPage from "@/pages/calendar/calendars.page";
import CalendarViewPage from "@/pages/calendar/calendarview.page";
import ForgottenpasswordPage from "@/pages/forgottenpassword.page";
import HomePage from "@/pages/home.page";
import LoginPage from "@/pages/login.page";
import LogoutPage from "@/pages/logout.page";
import PageNotFound from "@/pages/pagenotfound.page";
import RegisterPage from "@/pages/register.page";
import UnauthorizePage from "@/pages/unauthorize.page";
import UserPage from "@/pages/user.page";
import { RoleName } from "@/types/generated";
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router";

const AdminDashboardPage = lazy(() => import("@/pages/admin/admin.dashboard.page"));
const AllBeersPage = lazy(() => import("@/pages/admin/beers.page"));
const CalendarEditPage = lazy(() => import("@/pages/admin/calendar/calendar.edit.page"));
const CalendarDetailsPage = lazy(() => import("@/pages/admin/calendar/index.page"));
const EditUserPage = lazy(() => import("@/pages/admin/users/edit.user.page"));
const TokensPage = lazy(() => import("@/pages/admin/tokens.page"));
const TotalReviewsPage = lazy(() => import("@/pages/admin/total.reviews.page"));
const UsersPage = lazy(() => import("@/pages/admin/users/index.page"));
const BeerstylesPage = lazy(() => import("@/pages/admin/beerstyles.page"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                element: (
                    <RequireUser requiredAutorities={[RoleName.ROLE_USER, RoleName.ROLE_ADMIN, RoleName.ROLE_MASTER]} />
                ),
                children: [
                    { index: true, element: <HomePage /> },
                    {
                        element: <RequireUser requiredAutorities={["beer:read"]} />,
                        children: [
                            { path: "beers", element: <BeerPage /> },
                            { path: "beers/details/:id", element: <BeerDetailsPage /> },
                            {
                                element: <RequireUser requiredAutorities={["beer:create", "beer:update"]} />,
                                children: [{ path: "beers/edit/:id", element: <EditBeerPage /> }],
                            },
                            {
                                element: <RequireUser requiredAutorities={["beer:read"]} />,
                                children: [
                                    {
                                        element: <RequireUser requiredAutorities={["review:read"]} />,
                                        children: [{ path: "beers/reviews/:id", element: <BeerReviewsPage /> }],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        element: <RequireUser requiredAutorities={["calendar:read"]} />,
                        children: [
                            { path: "calendar", element: <CalendarsPage /> },
                            { path: "calendar/:calendarId", element: <CalendarViewPage /> },
                            {
                                element: <RequireUser requiredAutorities={["review:read"]} />,
                                children: [{ path: "calendar/:calendarId/:beerId/", element: <CalendarReviewPage /> }],
                            },
                        ],
                    },
                    {
                        element: <RequireUser requiredAutorities={["user:read"]} />,
                        children: [{ path: "user", element: <UserPage /> }],
                    },
                    {
                        element: <RequireUser requiredAutorities={[RoleName.ROLE_ADMIN, RoleName.ROLE_MASTER]} />,
                        children: [
                            {
                                path: "admin/beers",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <AllBeersPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        element: <RequireUser requiredAutorities={["calendar:create", "calendar:update"]} />,
                        children: [
                            {
                                path: "admin/calendar/edit/:id",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <CalendarEditPage />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "admin/calendar/:id",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <CalendarDetailsPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        element: <RequireUser requiredAutorities={["review:create", "review:update"]} />,
                        children: [
                            {
                                path: "admin/reviews",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <TotalReviewsPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        element: <RequireUser requiredAutorities={["user:create", "user:update"]} />,
                        children: [
                            {
                                path: "admin/users",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <UsersPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        path: "admin/users/:id",
                        element: (
                            <Suspense fallback={<FullScreenLoader />}>
                                <EditUserPage />
                            </Suspense>
                        ),
                    },
                    {
                        element: <RequireUser requiredAutorities={["calendartoken:create", "calendartoken:update"]} />,
                        children: [
                            {
                                path: "admin/tokens",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <TokensPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        element: <RequireUser requiredAutorities={["beerstyle:create"]} />,
                        children: [
                            {
                                path: "admin/beerstyles",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <BeerstylesPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        element: <RequireUser requiredAutorities={["dashboard"]} />,
                        children: [
                            {
                                path: "admin/dashboard",
                                element: (
                                    <Suspense fallback={<FullScreenLoader />}>
                                        <AdminDashboardPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    { path: "logout", element: <LogoutPage /> },
                    { path: "unauthorized", element: <UnauthorizePage /> },
                ],
            },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "forgottenpassword", element: <ForgottenpasswordPage /> },
            { path: "addtoken", element: <AddTokenPage /> },
        ],
    },
    { path: "*", element: <PageNotFound /> },
]);
export default router;

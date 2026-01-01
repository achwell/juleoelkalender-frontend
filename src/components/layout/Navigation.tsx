import LanguageSelector from "@/components/layout/LanguageSelector";
import { User } from "@/types/generated";
import { hasAuthority, isUserAdmin } from "@/utils";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsCalendar3 } from "react-icons/bs";
import { IoBeerSharp } from "react-icons/io5";
import { MdOutlineReviews, MdToken } from "react-icons/md";
import { PiBeerSteinLight } from "react-icons/pi";
import { RiDashboard2Fill, RiHome2Fill, RiLogoutBoxFill, RiMenu2Fill } from "react-icons/ri";
import { SiStyleshare } from "react-icons/si";
import { TbUser, TbUsersGroup } from "react-icons/tb";
import { Link } from "react-router";

interface Page {
    title: string;
    url: string;
    icon?: ReactNode;
}

const Navigation: FC<{ currentUser: User }> = ({ currentUser }) => {
    const [pages, setPages] = useState<Page[]>([]);

    const [mobileOpen, setMobileOpen] = useState(false);

    const { i18n, t } = useTranslation();

    const updateUser = async (user: User) => {
        const pages: Page[] = [
            { title: t("menu.home"), url: "/", icon: <RiHome2Fill /> },
            {
                title: t("menu.calendars"),
                url: "/calendar",
                icon: <BsCalendar3 />,
            },
            {
                title: t("menu.mybeers"),
                url: "/beers",
                icon: <PiBeerSteinLight />,
            },
            { title: t("menu.mypage"), url: "/user", icon: <TbUser /> },
        ];
        if (hasAuthority(user, "user:create")) {
            pages.push({
                title: t("menu.users"),
                url: "/admin/users",
                icon: <TbUsersGroup />,
            });
        }
        if (hasAuthority(user, "review:create")) {
            pages.push({
                title: t("menu.reviews"),
                url: "/admin/reviews",
                icon: <MdOutlineReviews />,
            });
        }
        if (hasAuthority(user, "calendartoken:create")) {
            pages.push({
                title: t("menu.token"),
                url: "/admin/tokens",
                icon: <MdToken />,
            });
        }
        if (isUserAdmin(user)) {
            pages.push({
                title: t("menu.allbeers"),
                url: "/admin/beers",
                icon: <IoBeerSharp />,
            });
        }
        if (hasAuthority(user, "beerstyle:create")) {
            pages.push({
                title: t("menu.beerstyles"),
                url: "/admin/beerstyles",
                icon: <SiStyleshare />,
            });
        }
        if (hasAuthority(user, "dashboard")) {
            pages.push({
                title: t("menu.dashboard"),
                url: "/admin/dashboard",
                icon: <RiDashboard2Fill />,
            });
        }
        pages.push({
            title: t("menu.logout"),
            url: "/logout",
            icon: <RiLogoutBoxFill />,
        });
        setPages(pages);
    };

    useEffect(() => {
        (async () => {
            if (currentUser) {
                await updateUser(currentUser);
            }
        })();

        return () => {};
    }, [currentUser]);

    useEffect(() => {
        (async () => {
            if (currentUser) {
                await updateUser(currentUser);
            }
        })();

        return () => {};
    }, [i18n.language]);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <div onClick={handleDrawerToggle} className="text-center">
            <ul className="divide-y divide-gray-200">
                {pages.map((page, index) => (
                    <li key={`${index}-m1`} className="p-0 text-left">
                        <Link to={page.url}>{page.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (!currentUser || pages.length === 0) {
        return null;
    }

    return (
        <>
            <header className="fixed top-0 left-0 w-full pl-16 bg-blue-600 shadow-md z-50">
                <div className="flex px-0 py-2">
                    <button
                        aria-label="open drawer"
                        className="absolute left-0 top-0 z-50 p-0 m-1 text-white bg-transparent border-0 rounded focus:outline-none md:hidden lg:hidden xl:hidden"
                        onClick={handleDrawerToggle}
                    >
                        <RiMenu2Fill />
                    </button>
                    <div className="hidden md:flex flex-row">
                        {pages.map((page, index) => (
                            <Link key={`${index}-m2`} to={page.url} className="pr-4 text-white menuLink">
                                {!!page.icon && page.icon}
                                <div className="hidden xl:flex">{page.title}</div>
                            </Link>
                        ))}
                    </div>
                    <LanguageSelector />
                </div>
            </header>
            <nav className="bg-gray-800 p-4">
                <div
                    className={`lg:hidden fixed inset-0 z-50 transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
                    role="dialog"
                    aria-labelledby="drawer-label"
                    aria-hidden={!mobileOpen}
                >
                    <div className="absolute inset-0 bg-black opacity-50" onClick={handleDrawerToggle}></div>
                    <div className="relative w-64 bg-white h-full">
                        <div className="p-4">{drawer}</div>
                    </div>
                </div>
            </nav>
        </>
    );
};
export default Navigation;

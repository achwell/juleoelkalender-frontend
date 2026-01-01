import FullScreenLoader from "@/components/FullScreenLoader";
import UserForm from "@/components/UserForm";
import MyBeersTable from "@/components/tables/MyBeersTable";
import { useGetUserQuery } from "@/redux/api/userApi";
import { setCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CalendarToken, NameEnum, User } from "@/types/generated";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const EditUserPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { currentUser } = useAppSelector((state) => state.authState);
    const { currentCalendarToken } = useAppSelector((state) => state.calendarTokenState);
    const { data, isFetching, refetch } = useGetUserQuery(id ? (id === "new" ? "" : id) : "", {
        skip: id === "new" || !id,
    });

    const [user, setUser] = useState<User>();

    useEffect(() => {
        if (id === "new") {
            const calendarToken: CalendarToken[] = [];
            if (currentCalendarToken) {
                calendarToken.push(currentCalendarToken);
            } else if (!!currentUser && currentUser.calendarToken.length > 0) {
                const token = currentUser.calendarToken.at(0);
                if (token) calendarToken.push(token);
            }
            setUser({
                area: "",
                beers: [],
                calendarToken,
                email: "",
                id: "",
                locked: false,
                firstName: "",
                middleName: "",
                lastName: "",
                password: "",
                role: { id: "", name: NameEnum.ROLE_USER, authorities: [], authority: NameEnum.ROLE_USER },
                createdDate: new Date(),
                facebookUserId: "",
                imageHeight: undefined,
                imageSilhouette: false,
                imageUrl: "",
                imageWidth: undefined,
                lastLoginDate: undefined,
            });
        } else if (data) {
            setUser(data);
        }
    }, [id, data]);

    const save = async (updatedUser: User) => {
        if (currentUser && currentUser.id === updatedUser.id) {
            dispatch(setCurrentUser({ ...currentUser, ...updatedUser }));
        }
        await refetch();
        navigate("/admin/users");
    };

    if (!currentUser || !user || isFetching) return <FullScreenLoader />;

    return (
        <>
            <UserForm
                user={user}
                loggedInUser={currentUser}
                saveCallback={save}
                from="/admin/users"
                cancelCallback={async () => navigate("/admin/users")}
            />
            <MyBeersTable beers={user.beers} page="/admin/users" />
        </>
    );
};
export default EditUserPage;

import FullScreenLoader from "@/components/FullScreenLoader";
import MyBeersTable from "@/components/tables/MyBeersTable";
import UserForm from "@/components/UserForm";
import { useGetUserQuery } from "@/redux/api/userApi";
import { setCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RoleName, User } from "@/types/generated";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

const EditUserPage = () => {
  const [openedAt] = useState(() => new Date());
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser } = useAppSelector((state) => state.authState);
  const { currentCalendarToken } = useAppSelector((state) => state.calendarTokenState);
  const { data, isFetching, refetch } = useGetUserQuery(id ? (id === "new" ? "" : id) : "", {
    skip: id === "new" || !id,
  });

  const user = useMemo(() => {
    if (id !== "new") return data;
    const calendarToken = currentCalendarToken
      ? [currentCalendarToken]
      : (currentUser?.calendarToken.slice(0, 1) ?? []);
    return {
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
      role: { id: "", name: RoleName.ROLE_USER, authorities: [], authority: RoleName.ROLE_USER },
      createdDate: openedAt,
      facebookUserId: "",
      imageHeight: undefined,
      imageSilhouette: false,
      imageUrl: "",
      imageWidth: undefined,
      lastLoginDate: undefined,
    };
  }, [id, data, currentCalendarToken, currentUser, openedAt]);

  const save = async (updatedUser: User) => {
    if (currentUser && currentUser.id === updatedUser.id) {
      dispatch(setCurrentUser({ ...currentUser, ...updatedUser }));
    }
    await refetch();
    navigate("/admin/users");
  };

  if (!user || isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <UserForm
        user={user}
        saveCallback={save}
        from="/admin/users"
        cancelCallback={async () => await navigate("/admin/users")}
      />
      <MyBeersTable beers={user.beers} page="/admin/users" />
    </>
  );
};
export default EditUserPage;

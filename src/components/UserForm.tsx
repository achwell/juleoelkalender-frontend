import ActionKnapper from "@/components/ActionKnapper";
import InputCheckbox from "@/components/form/InputCheckbox";
import InputEmail from "@/components/form/InputEmail";
import InputPassword from "@/components/form/InputPassword";
import InputSelect from "@/components/form/InputSelect";
import InputText from "@/components/form/InputText";
import Paragraph from "@/components/layout/Paragraph";
import { useGetCalendarTokensQuery } from "@/redux/api/calendarTokenApi";
import { useAddUserMutation, useGetUsersQuery, useUpdateUserMutation } from "@/redux/api/userApi";
import { setCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import userSchema from "@/schema/userSchema";
import { ButtonType } from "@/types/ButtonProps";
import { NameEnum, User } from "@/types/generated";
import { getNameOfUser, getRoleDescription, handleError, hasAuthority, isUserSystemAdmin } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface Props {
    user: User;
    saveCallback?: (user: User) => void;
    cancelCallback?: () => void;
    from: string;
}

interface UserInput {
    id?: string | undefined;
    firstName: string;
    middleName?: string | undefined;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    area?: string;
    roleName: NameEnum;
    locked: boolean;
    lastLoginDate?: Date;
    facebookUserId?: string;
    showPassword: boolean;
    token: string;
}

const ikkebyttpassord = "IKKEBYTTPASSORD";
const UserForm: FC<Props> = ({ user, saveCallback, cancelCallback, from }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.authState);

    const [
        addUser,
        { isLoading: isAdding, isSuccess: isSuccessAdd, data: newUser, isError: isAddError, error: addError },
    ] = useAddUserMutation();
    const [
        updateUser,
        {
            isLoading: isUpdating,
            isSuccess: isSuccessUpdate,
            data: updatedUser,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateUserMutation();
    const { data: calendarTokens } = useGetCalendarTokensQuery();
    const { data: allUsers } = useGetUsersQuery();
    const { facebookUserId, imageHeight, imageWidth, imageUrl, ...rest } = user;

    const methods = useForm<UserInput>({
        defaultValues: {
            ...rest,
            roleName: user.role.name as NameEnum,
            password: user.id ? ikkebyttpassord : "",
            confirmPassword: user.id ? ikkebyttpassord : "",
            showPassword: false,
            token: user.calendarToken.map((value) => value.token).join(","),
        },
        mode: "onChange",
        resolver: zodResolver(userSchema(t, allUsers ?? [])),
    });

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { isDirty, isValid },
        reset,
    } = methods;
    const { roleName, showPassword } = watch();

    useEffect(() => {
        const finish = async () => {
            if (!isAdding) {
                if (isSuccessAdd && newUser) {
                    toast.success(
                        t("add.added", {
                            field: getNameOfUser(newUser),
                        })
                    );
                    saveCallback && saveCallback(newUser);
                    navigate(from);
                } else if (isAddError && addError) {
                    handleError(t, addError);
                }
            }
        };
        finish();
    }, [isAdding]);

    useEffect(() => {
        const finish = async () => {
            if (!isUpdating) {
                if (isSuccessUpdate && updatedUser) {
                    if (user && currentUser && user.id === currentUser.id) {
                        dispatch(setCurrentUser(user));
                    }
                    toast.success(
                        t("update.updated", {
                            field: getNameOfUser(updatedUser),
                        })
                    );
                    saveCallback && saveCallback(updatedUser);
                    navigate(from);
                } else if (isUpdateError && updateError) {
                    handleError(t, updateError);
                }
            }
        };
        finish();
    }, [isUpdating]);

    const fixPassword = (newPassword?: string, oldPassword?: string) => {
        return (newPassword === ikkebyttpassord ? oldPassword : newPassword) ?? "";
    };

    const onSubmit = async (data: UserInput) => {
        const password = fixPassword(data.password, user.password);
        const calendarToken = data.token.split(",").map(
            (token) =>
                (calendarTokens ?? []).filter((c) => c.token === token).at(0) ?? {
                    id: "",
                    token,
                    name: "",
                    active: true,
                }
        );
        const userToSave: User = {
            ...user,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            email: data.email,
            password,
            area: data.area,
            role: {
                name: data.roleName,
                authorities: [],
                authority: "",
                id: "",
            },
            locked: user.id ? (data.locked ?? false) : false,
            calendarToken,
        };
        if (user.id) {
            updateUser(userToSave);
        } else {
            addUser(userToSave);
        }
    };

    const cancel = () => {
        reset({
            ...user,
            password: "",
            confirmPassword: "",
            showPassword: false,
        });
        if (cancelCallback) {
            cancelCallback();
        }
    };

    const roller = Object.keys(NameEnum).map((role) => ({
        key: role,
        value: getRoleDescription(t, role),
    }));
    const tokens = (calendarTokens ?? []).map((token) => ({
        key: token.token,
        value: token.name,
    }));

    if (!user || !calendarTokens) {
        return null;
    }
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="w-full">
                <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-start">
                        <InputText name="firstName" label={t("pages.user.firstName")} required={true} />
                        <InputText name="middleName" label={t("pages.user.middleName")} />
                        <InputText name="lastName" label={t("pages.user.lastName")} required={true} />
                        <InputEmail name="email" label={t("pages.user.email")} required={true} />
                        {hasAuthority(currentUser, "user:create") && currentUser?.id !== user.id ? (
                            <>
                                <InputSelect
                                    name="roleName"
                                    selectItems={roller}
                                    label={t("pages.user.role")}
                                    required={true}
                                />
                                <InputCheckbox name="locked" label={t("pages.user.locked")} />
                            </>
                        ) : (
                            <div className="mb-4">
                                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                                    {t("pages.user.role")}
                                </label>
                                <input
                                    id="roleName"
                                    name="roleName"
                                    type="text"
                                    value={roller.find((r) => r.key === roleName)?.value || ""}
                                    disabled
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                />
                            </div>
                        )}
                        {isUserSystemAdmin(currentUser) && currentUser?.id !== user.id && tokens.length > 1 ? (
                            <InputSelect
                                name="token"
                                selectItems={tokens}
                                label={t("pages.user.token")}
                                required={true}
                            />
                        ) : (
                            <input
                                aria-invalid="false"
                                name="token"
                                type="hidden"
                                value={user.calendarToken.map((value) => value.token).join(",")}
                            />
                        )}
                    </div>
                    <div className="flex flex-row justify-start items-start">
                        <InputText name="area" label={t("pages.user.area")} autoComplete="off" />
                        <Paragraph>{t("pages.user.areacomment")}</Paragraph>
                    </div>
                    <div className="flex flex-row justify-start items-start">
                        <Paragraph>{t("pages.user.changepasswordcomment")}</Paragraph>
                    </div>
                    <div className="flex flex-row justify-start items-start">
                        <InputPassword
                            name="password"
                            label={t("pages.user.password")}
                            showPassword={showPassword}
                            toggleShowPassword={() => setValue("showPassword", !showPassword)}
                        />
                        <InputPassword
                            name="confirmPassword"
                            label={t("pages.user.confirmpassword")}
                            showPassword={showPassword}
                            toggleShowPassword={() => setValue("showPassword", !showPassword)}
                        />
                    </div>
                    {user?.imageUrl && (
                        <div className="flex flex-row justify-start items-start">
                            <img
                                src={user.imageUrl}
                                height={user.imageHeight}
                                width={user.imageWidth}
                                alt={getNameOfUser(user)}
                            />
                        </div>
                    )}
                    <div className="flex flex-row justify-start items-start">
                        <ActionKnapper
                            buttons={[
                                {
                                    text: isUpdating ? t("buttons.saving") : t("buttons.save"),
                                    icon: ButtonType.SUBMIT,
                                    variant: "contained",
                                    onClick: () => {},
                                    disabled: isUpdating || (!isDirty && !isValid),
                                },
                                {
                                    text: t("buttons.cancel"),
                                    icon: ButtonType.CANCEL,
                                    onClick: cancel,
                                },
                            ]}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
export default UserForm;

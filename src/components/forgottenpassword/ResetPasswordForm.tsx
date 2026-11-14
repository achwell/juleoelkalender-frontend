import ActionKnapper from "@/components/ActionKnapper";
import InputEmail from "@/components/form/InputEmail";
import InputPassword from "@/components/form/InputPassword";
import InputText from "@/components/form/InputText";
import FullScreenLoader from "@/components/FullScreenLoader";
import {
  useChangePasswordMutation,
  useDeletePasswordChangeRequestMutation,
  useGetPasswordChangeRequestsQuery,
} from "@/redux/api/passwordChangeRequestApi";
import requestPasswordConfirmSchema from "@/schema/requestPasswordConfirmSchema";
import { ButtonType } from "@/types/ButtonProps";
import ForgottenpasswordProps from "@/types/ForgottenpasswordProps";
import { PasswordChangeRequest, User } from "@/types/generated";
import { getNameOfUser, handleErrorWithStatus } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addHours, isAfter } from "date-fns";
import { FC } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const isTokenUnexpired = (created: string | Date) => isAfter(addHours(created, 1), new Date());

const ResetPasswordForm: FC<{
  passwordChangeRequest: PasswordChangeRequest;
}> = ({ passwordChangeRequest }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const methods = useForm<ForgottenpasswordProps>({
    defaultValues: {
      email: passwordChangeRequest.email,
      password: "",
      confirmPassword: "",
      token: passwordChangeRequest.token,
      showPassword: false,
    },
    mode: "onChange",
    resolver: zodResolver(requestPasswordConfirmSchema(t)),
  });
  const { data: passwordChangeRequests, isFetching } = useGetPasswordChangeRequestsQuery();
  const [deletePasswordChangeRequest, { isLoading: isDeleting }] = useDeletePasswordChangeRequestMutation();
  const [changePasswordRequest] = useChangePasswordMutation();
  const changePassword = async (...args: Parameters<typeof changePasswordRequest>) => {
    const result = await changePasswordRequest(...args);

    if ("data" in result && result.data) {
      handleOk(result.data);
    } else if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
    }

    return result;
  };

  const {
    formState: { errors },
    handleSubmit,
    setValue,
  } = methods;
  const { showPassword } = useWatch({ control: methods.control });

  const handleOk = async (user: User) => {
    toast.success(t("pages.forgottenpassword.successmessage", { name: getNameOfUser(user) }));
    await deletePasswordChangeRequest(passwordChangeRequest.id);
    navigate("/login");
  };

  const onSubmit = async (data: ForgottenpasswordProps) => {
    if (!passwordChangeRequests) {
      return;
    }
    const { email, token } = data;
    const controlToken = passwordChangeRequests.find((d) => d.email === email && d.token === token);
    if (controlToken) {
      if (isTokenUnexpired(controlToken.created)) {
        changePassword(data);
      } else {
        toast.error(t("pages.forgottenpassword.invalidtoken"));
      }
    } else {
      toast.error(t("pages.forgottenpassword.invalidtoken"));
    }
  };

  if (!passwordChangeRequest || isFetching) {
    return <FullScreenLoader />;
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="flex flex-col space-y-2">
          <InputEmail name="email" label={t("pages.forgottenpassword.email")} disabled={true} required={true} />
          <InputText name="token" label={t("pages.forgottenpassword.token")} disabled={true} required={true} />
          <InputPassword
            name="password"
            label={t("pages.forgottenpassword.password")}
            required={true}
            showPassword={showPassword}
            toggleShowPassword={() => setValue("showPassword", !showPassword)}
          />
          <InputPassword
            name="confirmPassword"
            label={t("pages.forgottenpassword.confirmpassword")}
            required={true}
            showPassword={showPassword}
            toggleShowPassword={() => setValue("showPassword", !showPassword)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <ActionKnapper
            buttons={[
              {
                icon: ButtonType.SUBMIT,
                text: t("pages.forgottenpassword.setnewpassword"),
                variant: "contained",
                onClick: () => {},
                disabled: isDeleting ?? (errors && (!!errors.password || !!errors.confirmPassword)),
                type: "submit",
              },
            ]}
          />
        </div>
      </form>
    </FormProvider>
  );
};
export default ResetPasswordForm;

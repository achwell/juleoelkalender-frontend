import InputSelect from "@/components/form/InputSelect";
import { setCurrentCalendarToken } from "@/redux/features/calendarTokenSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import SelectItem from "@/types/SelectItem";
import { User } from "@/types/generated";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";

const CurrentCalendarTokenChooser: FC<{
    currentUser: User | null;
}> = ({ currentUser }) => {
    const dispatch = useAppDispatch();
    const { currentCalendarToken } = useAppSelector((state) => state.calendarTokenState);
    const methods = useForm<{
        token: string;
    }>({
        mode: "onChange",
        defaultValues: {
            token: currentCalendarToken ? currentCalendarToken.token : "",
        },
    });
    const { handleSubmit } = methods;

    if (!currentCalendarToken || !currentUser || currentUser.calendarToken.length === 1) {
        return null;
    }
    const selectItems: SelectItem[] = currentUser.calendarToken.map((value) => {
        return {
            key: value.token,
            value: value.name,
        };
    });

    const byttToken = (token: string) => {
        const state = currentUser.calendarToken.filter((t) => t.token === token).at(0);
        dispatch(setCurrentCalendarToken(state ? state : null));
    };

    return (
        <div className="my-12 flex flex-col justify-center items-center w-[100vw]">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(() => {})} className="space-y-2 w-full">
                    <InputSelect name="token" selectItems={selectItems} label="" callback={byttToken} />
                </form>
            </FormProvider>
        </div>
    );
};
export default CurrentCalendarTokenChooser;

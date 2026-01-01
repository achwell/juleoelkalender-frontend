import ActionKnapper from "@/components/ActionKnapper";
import InputNumber from "@/components/form/InputNumber";
import InputTextArea from "@/components/form/InputTextArea";
import Paragraph from "@/components/layout/Paragraph";
import { useAddReviewMutation, useUpdateReviewMutation } from "@/redux/api/reviewApi";
import reviewWithoutChildrenSchema from "@/schema/reviewWithoutChildrenSchema";
import { ButtonType } from "@/types/ButtonProps";
import { Review } from "@/types/generated";
import { handleError } from "@/utils";
import { Resolver } from "@hookform/resolvers/ajv";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

interface Props {
    review: Review;
    callback: () => void;
    from?: string | null;
}

interface ReviewProps {
    ratingLabel: number;
    ratingLooks: number;
    ratingSmell: number;
    ratingTaste: number;
    ratingFeel: number;
    ratingOverall: number;
    comment?: string | undefined;
}

const ReviewForm: FC<Props> = ({ review, callback, from }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [
        addReview,
        {
            isLoading: isAdding,
            isSuccess: isSuccessAdding,
            data: newReview,
            isError: isErrorAdding,
            error: errorAdding,
        },
    ] = useAddReviewMutation();
    const [
        updateReview,
        {
            isLoading: isUppdating,
            isSuccess: isSuccessUppdating,
            data: updatedReview,
            isError: isErrorUppdating,
            error: errorUppdating,
        },
    ] = useUpdateReviewMutation();

    const schema = reviewWithoutChildrenSchema(t);
    // @ts-ignore
    const resolver: Resolver<ReviewProps> = zodResolver(schema);
    const methods = useForm<ReviewProps>({
        defaultValues: review,
        mode: "onChange",
        resolver: resolver,
    });
    const { handleSubmit } = methods;

    useEffect(() => {
        const finish = async () => {
            if (!isAdding) {
                if (isSuccessAdding && newReview) {
                    toast.success(t("add.added", { field: t("pages.calendar.review.vote") }));
                    callback && callback();
                    navigate(from ? from : `/calendar/${review.calendar.id}`);
                } else if (isErrorAdding && errorAdding) {
                    handleError(t, errorAdding);
                }
            }
        };
        finish();
    }, [isAdding, isSuccessAdding, isErrorAdding]);

    useEffect(() => {
        const finish = async () => {
            if (!isUppdating) {
                if (isSuccessUppdating && updatedReview) {
                    toast.success(t("update.updated", { field: t("pages.calendar.review.vote") }));
                    callback && callback();
                    navigate(from ? from : `/calendar/${review.calendar.id}`);
                } else if (isErrorUppdating && errorUppdating) {
                    handleError(t, errorUppdating);
                }
            }
        };
        finish();
    }, [isUppdating, isSuccessUppdating, isErrorUppdating]);

    const onSubmit = async (submitData: ReviewProps) => {
        const data = {
            id: review.id,
            createdAt: review.createdAt,
            beer: review.beer,
            calendar: review.calendar,
            reviewer: review.user,
            ratingFeel: +submitData.ratingFeel,
            ratingLabel: +submitData.ratingLabel,
            ratingLooks: +submitData.ratingLooks,
            ratingOverall: +submitData.ratingOverall,
            ratingSmell: +submitData.ratingSmell,
            ratingTaste: +submitData.ratingTaste,
            comment: submitData.comment,
        };

        if (!review.id || review.id === "") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = data;
            addReview(rest);
        } else {
            updateReview(data);
        }
    };

    return (
        <FormProvider {...methods}>
            <Paragraph>
                {t("pages.calendar.review.ingress")}{" "}
                <Link
                    to="https://norbrygg.no/bedomming-av-ol/dommerskjema/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    {t("pages.calendar.review.ingresslinktext")}
                </Link>
                {t("pages.calendar.review.ingress2")}
            </Paragraph>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="w-[50vw] mx-auto">
                <div className="flex flex-col justify-start items-start">
                    <InputNumber
                        name="ratingTaste"
                        label={t("rating.taste") + " " + t("rating.taste", { number: 20 })}
                        required={true}
                        min={0}
                        max={20}
                        step={0.1}
                    />
                    <InputNumber
                        name="ratingSmell"
                        label={t("rating.smell") + " " + t("rating.taste", { number: 12 })}
                        required={true}
                        min={0}
                        max={12}
                        step={0.1}
                    />
                    <InputNumber
                        name="ratingLooks"
                        label={t("rating.looks") + " " + t("rating.taste", { number: 3 })}
                        required={true}
                        min={0}
                        max={3}
                        step={0.1}
                    />
                    <InputNumber
                        name="ratingFeel"
                        label={t("rating.feel") + " " + t("rating.taste", { number: 5 })}
                        required={true}
                        min={0}
                        max={5}
                        step={0.1}
                    />
                    <InputNumber
                        name="ratingLabel"
                        label={t("rating.label") + " " + t("rating.taste", { number: 5 })}
                        required={true}
                        min={0}
                        max={5}
                        step={0.1}
                    />
                    <InputNumber
                        name="ratingOverall"
                        label={t("rating.overall") + " " + t("rating.taste", { number: 10 })}
                        required={true}
                        min={0}
                        max={10}
                        step={0.1}
                    />
                    <InputTextArea name="comment" label={t("rating.comments")} />
                    <ActionKnapper
                        buttons={[
                            {
                                icon: ButtonType.SUBMIT,
                                text: (isAdding ?? isUppdating) ? t("buttons.saving") : t("buttons.save"),
                                variant: "contained",
                                onClick: () => {},
                            },
                            {
                                icon: ButtonType.CANCEL,
                                text: t("buttons.cancel"),
                                onClick: () => navigate(from ? from : `/calendar/${review.calendar.id}`),
                            },
                        ]}
                    />
                </div>
            </form>
        </FormProvider>
    );
};
export default ReviewForm;

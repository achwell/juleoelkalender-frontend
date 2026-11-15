import ActionKnapper from "@/components/ActionKnapper";
import InputNumber from "@/components/form/InputNumber";
import InputTextArea from "@/components/form/InputTextArea";
import Paragraph from "@/components/layout/Paragraph";
import { useAddReviewMutation, useUpdateReviewMutation } from "@/redux/api/reviewApi";
import reviewWithoutChildrenSchema from "@/schema/reviewWithoutChildrenSchema";
import { ButtonType } from "@/types/ButtonProps";
import { Review } from "@/types/generated";
import { handleErrorWithStatus } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { z } from "zod";

interface Props {
  review: Review;
  callback: () => void;
  from?: string | null;
}

const ReviewForm: FC<Props> = ({ review, callback, from }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [addReviewRequest, { isLoading: isAdding }] = useAddReviewMutation();
  const addReview = async (...args: Parameters<typeof addReviewRequest>) => {
    const result = await addReviewRequest(...args);

    if ("data" in result && result.data) {
      toast.success(t("add.added", { field: t("pages.calendar.review.vote") }));
      callback?.();
      navigate(from ?? `/calendar/${review.calendar.id}`);
    } else if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
    }

    return result;
  };

  const [updateReviewRequest, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const updateReview = async (...args: Parameters<typeof updateReviewRequest>) => {
    const result = await updateReviewRequest(...args);

    if ("data" in result && result.data) {
      toast.success(t("update.updated", { field: t("pages.calendar.review.vote") }));
      callback?.();
      navigate(from ?? `/calendar/${review.calendar.id}`);
    } else if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
    }

    return result;
  };
  const isSaving = isAdding || isUpdating;

  const schema = reviewWithoutChildrenSchema(t);
  type ReviewFormInput = z.input<typeof schema>;
  type ReviewFormOutput = z.output<typeof schema>;
  const methods = useForm<ReviewFormInput, unknown, ReviewFormOutput>({
    defaultValues: review,
    mode: "onChange",
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<ReviewFormOutput> = async (submitData) => {
    if (isSaving) {
      return;
    }

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
                text: isSaving ? t("buttons.saving") : t("buttons.save"),
                variant: "contained",
                onClick: () => {},
                disabled: isSaving,
              },
              {
                icon: ButtonType.CANCEL,
                text: t("buttons.cancel"),
                onClick: async () => await navigate(from ?? `/calendar/${review.calendar.id}`),
              },
            ]}
          />
        </div>
      </form>
    </FormProvider>
  );
};
export default ReviewForm;

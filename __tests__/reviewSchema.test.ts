import reviewWithoutChildrenSchema from "../src/schema/reviewWithoutChildrenSchema";
import type TextFunction from "../src/types/TextFunction";
import { expect, it } from "vitest";

const t = ((key: string) => key) as TextFunction;

it("coerces review ratings to numbers and validates their bounds", () => {
  const result = reviewWithoutChildrenSchema(t).safeParse({
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ratingLabel: "4",
    ratingLooks: "2",
    ratingTaste: "15",
    ratingSmell: "10",
    ratingFeel: "4",
    ratingOverall: "8",
  });

  const parsed = result.success ? result.data : undefined;
  expect(result.success).toBe(true);
  expect(parsed?.ratingTaste).toBe(15);
  expect(typeof parsed?.ratingTaste).toBe("number");
});

it("rejects review ratings outside their allowed range", () => {
  const result = reviewWithoutChildrenSchema(t).safeParse({
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ratingLabel: "6",
    ratingLooks: "2",
    ratingTaste: "15",
    ratingSmell: "10",
    ratingFeel: "4",
    ratingOverall: "8",
  });

  expect(result.success).toBe(false);
});

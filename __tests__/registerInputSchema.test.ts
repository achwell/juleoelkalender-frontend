import { createInstance } from "i18next";
import { describe, expect, it } from "vitest";
import registerInputSchema from "../src/schema/registerInputSchema";
import type RegisterInput from "../src/types/RegisterInput";

const i18n = createInstance();
await i18n.init({ lng: "en", resources: { en: { translation: {} } } });
const schema = registerInputSchema(i18n.t);
const validInput: RegisterInput = {
  calendarToken: "calendar-token",
  firstName: "First",
  lastName: "Last",
  email: "user@example.com",
  password: "password123",
  confirmPassword: "password123",
  showPassword: false,
};

describe("registerInputSchema", () => {
  it("accepts registration without optional fields", () => {
    expect(schema.parse(validInput)).toEqual(validInput);
  });

  it.each(["calendarToken", "firstName", "lastName", "password"] as const)("requires %s in the schema", (field) => {
    expect(schema.shape[field].safeParse(undefined).success).toBe(false);
    for (const value of [undefined, "", "   "]) {
      const result = schema.safeParse({ ...validInput, [field]: value });
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((issue) => issue.path[0] === field)).toBe(true);
    }
  });

  it("keeps the existing field length limits", () => {
    for (const [field, value] of [
      ["calendarToken", "a".repeat(101)],
      ["firstName", "a".repeat(256)],
      ["lastName", "a".repeat(256)],
      ["middleName", "a".repeat(256)],
      ["password", "short"],
      ["password", "a".repeat(33)],
    ]) {
      const result = schema.safeParse({ ...validInput, [field]: value });
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((issue) => issue.path[0] === field)).toBe(true);
    }
  });

  it("rejects mismatched passwords", () => {
    const result = schema.safeParse({ ...validInput, confirmPassword: "different123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(["password", "confirmPassword"]);
  });
});

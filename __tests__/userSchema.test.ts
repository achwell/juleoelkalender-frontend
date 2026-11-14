import { createInstance } from "i18next";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import userSchema from "../src/schema/userSchema";
import { RoleName } from "../src/types/generated";

const i18n = createInstance();
await i18n.init({ lng: "en", resources: { en: { translation: {} } } });
const schema = userSchema(i18n.t, []);
const validInput: z.infer<typeof schema> = {
  firstName: "First",
  lastName: "Last",
  email: "user@example.com",
  password: "password123",
  confirmPassword: "password123",
  showPassword: false,
  roleName: RoleName.ROLE_USER,
  token: "calendar-token",
};

describe("userSchema", () => {
  it("accepts user input without optional fields", () => {
    expect(schema.parse(validInput)).toEqual(validInput);
  });

  it.each(["firstName", "lastName", "password"] as const)("requires %s", (field) => {
    expect(schema.shape[field].safeParse(undefined).success).toBe(false);
    for (const value of [undefined, "", "   "]) {
      const result = schema.safeParse({ ...validInput, [field]: value });
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((issue) => issue.path[0] === field)).toBe(true);
    }
  });

  it("accepts the existing unchanged-password placeholder", () => {
    expect(
      schema.safeParse({
        ...validInput,
        password: "IKKEBYTTPASSORD",
        confirmPassword: "IKKEBYTTPASSORD",
      }).success,
    ).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = schema.safeParse({ ...validInput, confirmPassword: "different123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === "confirmPassword")).toBe(true);
  });
});

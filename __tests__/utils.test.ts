import { describe, expect, it } from "vitest";
import { RoleName, User } from "../src/types/generated";
import {
    calculateAverage,
    findFirstAvailableDay,
    formateRatingvalue,
    getNameOfUser,
    getRoleDescription,
    hasAuthority,
    isUserAdmin,
    isUserSystemAdmin,
    secondsToDhms,
    translateStatus,
} from "../src/utils";

const roleUser = {
    id: "1",
    name: RoleName.ROLE_USER,
    authorities: [{ id: "1", name: "none" }],
    authority: RoleName.ROLE_USER,
};
const roleAdmin = {
    name: RoleName.ROLE_ADMIN,
    authorities: [
        { id: "1", name: "none" },
        { id: "2", name: "some" },
    ],
    authority: RoleName.ROLE_ADMIN,
};

const roleMaster = {
    name: RoleName.ROLE_MASTER,
    authorities: [
        { id: "1", name: "none" },
        { id: "2", name: "some" },
        { id: "3", name: "all" },
    ],
    authority: RoleName.ROLE_MASTER,
};

const user: User = {
    createdDate: undefined,
    imageSilhouette: false,
    area: undefined,
    beers: [],
    calendarToken: [],
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    locked: false,
    middleName: undefined,
    password: "",
    role: roleUser,
};

const t = (key: string) => key;
describe("getRoleDescription", () => {
    it("roleUser", () => {
        expect(getRoleDescription(t, roleUser.name)).toBe("role.user");
    });
    it("roleAdmin", () => {
        expect(getRoleDescription(t, roleAdmin.name)).toBe("role.admin");
    });
    it("roleMaster", () => {
        expect(getRoleDescription(t, roleMaster.name)).toBe("role.master");
    });
    it("unknown", () => {
        expect(getRoleDescription(t, "UNKNOWN")).toBe("");
    });
});

describe("isUserAdmin", () => {
    it("User is null", () => {
        expect(isUserAdmin(null)).toBe(false);
    });
    it("User is undefined", () => {
        expect(isUserAdmin(undefined)).toBe(false);
    });
    it("User is not admin", () => {
        expect(isUserAdmin(user)).toBe(false);
    });
    it("User is admin", () => {
        expect(isUserAdmin({ ...user, role: roleAdmin })).toBe(true);
    });
    it("User is master", () => {
        expect(isUserAdmin({ ...user, role: roleMaster })).toBe(true);
    });
});

describe("isUserSystemAdmin", () => {
    it("User is null", () => {
        expect(isUserSystemAdmin(null)).toBe(false);
    });
    it("User is undefined", () => {
        expect(isUserSystemAdmin(undefined)).toBe(false);
    });
    it("User is not admin", () => {
        expect(isUserSystemAdmin(user)).toBe(false);
    });
    it("User is admin", () => {
        expect(isUserSystemAdmin({ ...user, role: roleAdmin })).toBe(false);
    });
    it("User is master", () => {
        expect(isUserSystemAdmin({ ...user, role: roleMaster })).toBe(true);
    });
});
describe("hasAuthority", () => {
    it("null User", () => {
        expect(hasAuthority(null, "none")).toBe(false);
    });
    it("roleUser", () => {
        expect(hasAuthority(user, "none")).toBe(true);
    });
    it("roleUser - admin", () => {
        expect(hasAuthority(user, "some")).toBe(false);
    });
    it("roleAdmin", () => {
        expect(hasAuthority({ ...user, role: roleAdmin }, "some")).toBe(true);
    });
    it("roleAdmin - master", () => {
        expect(hasAuthority({ ...user, role: roleAdmin }, "all")).toBe(false);
    });
    it("roleMaster", () => {
        expect(hasAuthority({ ...user, role: roleMaster }, "all")).toBe(true);
    });
});

describe("findFirstAvailableDay", () => {
    it("123", () => {
        expect(findFirstAvailableDay([1, 2, 3])).toBe(4);
    });
    it("124", () => {
        expect(findFirstAvailableDay([1, 2, 4])).toBe(3);
    });
    it("empty", () => {
        expect(findFirstAvailableDay([])).toBe(1);
    });
    it("roleMaster", () => {
        expect(
            findFirstAvailableDay([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            ])
        ).toBe(1);
    });
});

describe("calculateAverage", () => {
    it("empty", () => {
        expect(calculateAverage([])).toStrictEqual({
            ratingFeel: 0,
            ratingLabel: 0,
            ratingLooks: 0,
            ratingOverall: 0,
            ratingSmell: 0,
            ratingTaste: 0,
        });
    });
    it("with data", () => {
        expect(
            calculateAverage([
                {
                    ratingFeel: 1,
                    ratingLabel: 1,
                    ratingLooks: 1,
                    ratingOverall: 1,
                    ratingSmell: 1,
                    ratingTaste: 1,
                },
                {
                    ratingFeel: 1,
                    ratingLabel: 2,
                    ratingLooks: 3,
                    ratingOverall: 4,
                    ratingSmell: 5,
                    ratingTaste: 6,
                },
                {
                    ratingFeel: 3,
                    ratingLabel: 3,
                    ratingLooks: 3,
                    ratingOverall: 3,
                    ratingSmell: 3,
                    ratingTaste: 3,
                },
            ])
        ).toStrictEqual({
            ratingFeel: 1.6666666666666667,
            ratingLabel: 2,
            ratingLooks: 2.3333333333333335,
            ratingOverall: 2.6666666666666665,
            ratingSmell: 3,
            ratingTaste: 3.3333333333333335,
        });
    });
});

describe("secondsToDhms", () => {
    it("1", () => {
        expect(secondsToDhms(t, 1)).toBe("1 time.short.second");
    });
    it("1000", () => {
        expect(secondsToDhms(t, 1000)).toBe("16 time.short.minute, 40 time.short.second");
    });
    it("1000000", () => {
        expect(secondsToDhms(t, 1000000)).toBe(
            "11 time.short.day, 13 time.short.hour, 46 time.short.minute, 40 time.short.second"
        );
    });
    it("1000000000", () => {
        expect(secondsToDhms(t, 1000000000)).toBe(
            "11574 time.short.day, 1 time.short.hour, 46 time.short.minute, 40 time.short.second"
        );
    });
});

describe("translateStatus", () => {
    it("UP", () => {
        expect(translateStatus(t, "UP")).toBe("status.up");
    });
    it("DOWN", () => {
        expect(translateStatus(t, "DOWN")).toBe("status.down");
    });
    it("OUT_OF_SERVICE", () => {
        expect(translateStatus(t, "OUT_OF_SERVICE")).toBe("status.outofservice");
    });
    it("UNKNOWN", () => {
        expect(translateStatus(t, "UNKNOWN")).toBe("status.unknown");
    });
});

describe("getNameOfUser", () => {
    it("only firstName", () => {
        expect(getNameOfUser({ ...user, firstName: "First" })).toBe("First");
    });
    it("firstName and lastName", () => {
        expect(getNameOfUser({ ...user, firstName: "First", lastName: "Name" })).toBe("First Name");
    });
    it("OUT_OF_SERVICE", () => {
        expect(
            getNameOfUser({
                ...user,
                firstName: "First",
                middleName: "Middle",
                lastName: "Name",
            })
        ).toBe("First Middle Name");
    });
    it("No name", () => {
        expect(getNameOfUser(user)).toBe("");
    });
});

describe("formateRatingvalue", () => {
    it("null", () => {
        expect(formateRatingvalue(null)).toBe("");
    });
    it("undefined", () => {
        expect(formateRatingvalue(undefined)).toBe("");
    });
    it("Integer", () => {
        expect(formateRatingvalue(1)).toBe("1.0");
    });
    it("Double", () => {
        expect(formateRatingvalue(2.99999)).toBe("3.0");
    });
});

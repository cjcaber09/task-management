import type { CompanyType } from "../../server/src/types/company.types";
export type RegisterUserInput = {
    email: string;
    password: string;
    confirmPassword: string;
    userInfo: {
        name: string;
    };
    companyInfo?: CompanyType | null;
};
export type LoginUserInput = {
    email: string;
    password: string;
};
export type UserType = {
    guid: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
};
//# sourceMappingURL=user.d.ts.map
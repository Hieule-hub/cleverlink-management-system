declare module "User" {
    interface UserLoginReq {
        userId: string;
        password: string;
    }

    interface UserLoginRes {
        _id: string;
        userId: string;
        roleId: Role;
        name: string;
        status: string;
        __v: number;
        createdAt: string;
        updatedAt: string;
        refresh: string;
        access: string;
    }

    interface UserInfo {
        _id: string;
        userId: string;
        roleId: Role;
        name: string;
        status: string;
        __v: number;
        createdAt: string;
        updatedAt: string;
    }

    interface Role {
        _id: string;
        name: string;
        code: RoleCode;
        __v: number;
    }

    type RoleCode = "CIP" | "TU" | "BU" | "GU"; // CIP: Customer Information Provider, TU: Technical User, BU: Business User, GU: Guest User
}

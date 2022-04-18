type accessLevels = "Regular" | "Admin";
export type User  = {
    id: string | null,
    name: string,
    username : string,
    email: string,
    accessLevel: (accessLevels | null)[],
};

export type UserAuthCookie = {
    zipAuthHash: string;
    expires: Date;
    username: string;
};

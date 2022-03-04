type accessLevels = "Regular" | "Admin";
export type User  = {
    id: string | null,
    name: string,
    username : string,
    email: string,
    accessLevel: (accessLevels | null)[],
}

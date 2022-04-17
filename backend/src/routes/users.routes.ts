import { User, UserAuthCookie } from "../models/user.model";
import DBConnector from "../services/dbConnector.service";
import UserService from "../services/users.service";

export default class UserRoutes {
    userService: UserService;
    private userCookies: Map<string, UserAuthCookie>;
    constructor(db: DBConnector) {
        this.userService = new UserService(db);
        // <cookieValue, cookieObject>
        this.userCookies = new Map<string, UserAuthCookie>();
    }

    async loginUser(requestBody: { username: string, password: string }): Promise<{ userDetails: User } & { cookie: UserAuthCookie }> {
        if (requestBody.password.length === 0 || requestBody.username.length === 0) {
            throw new Error("EmptyFieldError");
        }
        else {
            const result = await this.userService.login(requestBody.username, requestBody.password);

            if (typeof result === "boolean") {
                throw new Error("FailedToLogin");
            }
            else {
                const newCookie = this.createCookie(requestBody.username);
                this.userCookies.set(newCookie.zipAuthHash, newCookie);
                return { userDetails: result, cookie: newCookie };
            }
        }
    }

    isLoggedInUser(cookieValue: string): boolean {
        return this.userCookies.has(cookieValue);
    }

    async getUserInfoFromCookie(cookieValue: string): Promise<User> {
        const username = this.userCookies.get(cookieValue)?.username;
        if (username) {
            return await this.userService.getUser(username);
        }
    }

    async registerUser(requestBody: { username: string, password: string, email: string }): Promise<{ userDetails: User, cookie: UserAuthCookie }> {
        for (const value in Object.values(requestBody)) {
            if (value.length === 0) {
                throw new Error(`EmptyFieldError`);
            }

        }

        if (!this.isUakronEmail(requestBody.email)) {
            throw new Error(`InvalidEmailAddress`);
        }
        const newUser: User = {
            id: "",
            name: "",
            username: requestBody.username,
            email: requestBody.email,
            accessLevel: ["Regular"],
        }

        const isRegistered = await this.userService.registerUser({
            ...newUser,
            password: requestBody.password,
        });

        if (isRegistered) {
            const newCookie = this.createCookie(requestBody.username);
            this.userCookies.set(newCookie.zipAuthHash, newCookie);
            return { cookie: newCookie, userDetails: newUser };
        }
        else {
            throw new Error("FailedToRegister");
        }

    }

    // ensures email is a valid uakron email and then grabs the userId from email
    private isUakronEmail(email: string) {
        if (email != null) {
            return email.includes("uakron.edu");
        }
        else return false;
    }

    private getIdFromEmail(email: string) {
        let id;
        if (this.isUakronEmail(email)) {
            id = email.substring(0, email.search('@'));
        }
        return id;
    }

    createCookie(username: string) {

        let newCookieHash = '~';

        while (newCookieHash.length < 20) {
            newCookieHash += Math.random() * 10 + Math.random() * (-10);
        }
        const newCookie: UserAuthCookie = {
            zipAuthHash: newCookieHash,
            expires: new Date(Date.now() + 90000),
            username,
        }

        return newCookie;
    }
}
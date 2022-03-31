import { User } from "../models/user.model";
import DBConnector from "../services/dbConnector.service";
import UserService from "../services/users.service";

export default class UserRoutes {
    userService: UserService;
    constructor(db: DBConnector) {
        this.userService = new UserService(db);
    }

    loginUser(requestBody: { username: string, password: string }): Promise<User> {
        if (requestBody.password.length === 0 || requestBody.username.length === 0) {
            throw new Error("EmptyFieldError");
        }
        else {
            return this.userService.login(requestBody.username, requestBody.password).then(
                result => {
                    if (typeof result === "boolean") {
                        throw new Error("FailedToLogin");
                    }
                    else {
                        return result;
                    }
                }
            );
        }
    }

    isLoggedInUser( username: string) {
       return this.userService.isLoggedInUser(username);
    }

    async registerUser(requestBody: { username: string, password: string, email: string }): Promise<User> {
        for (const value in Object.values(requestBody)) {
            if (value.length === 0) {
                throw new Error(`EmptyFieldError`);
            }

        }

        if(!this.isUakronEmail(requestBody.email)) {
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

        if(isRegistered) {
            return newUser;
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
}
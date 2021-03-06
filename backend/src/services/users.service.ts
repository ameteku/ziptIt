import { User, UserAuthCookie } from "../models/user.model";
import DBConnector from "./dbConnector.service";
import type dbConstants from "../constants/dbConstants";

export default class UserService {
    db: DBConnector;
    private loggedInUsers: Map<string, string>;
    // <userName, cookie>


    constructor(database: DBConnector) {
        this.db = database;
        // <username, docId>
        this.loggedInUsers = new Map<string, string>();

    }

    // checks if user is in db using password and username/email,
    // if so add username as key with docid as value and return user data
    // if not return user not found error
    async login(username: string, password: string): Promise<boolean | User> {
        if (username.length === 0 || password.length === 0) {
            console.log("empty field");
            return false;
        }
        console.log("no empty field");

        return await this.db.database.collection("users").where("username", "==", username)?.where("password", "==", this.hashPassword(password))
            .get()
            .then(result => {
                if (result.docs.length === 0) {
                    return false;
                }
                else {
                    const userData = result.docs[0].data();
                    this.loggedInUsers.set(userData.username as string, result.docs[0].id);

                    console.log("cookie created and set");
                    return {
                        id: result.docs[0].id,
                        name: userData.name,
                        username: userData.username,
                        email: userData.email,
                        accessLevel: userData.accessLevel
                    }
                }
            }).catch(error => {
                console.log(`Error logging in user: ${error}`);
                return false;
            });
    }

    isLoggedInUser = (username: string) => this.loggedInUsers.has(username);


    // removes user key:value from map if available
    // logout() {

    // }

    // checks for all correct credentials
    // hashes the password provided
    // adds user data to db
    async registerUser(userData: User & { password: string }): Promise<boolean> {
        if (userData.email.length === 0 || userData.username.length === 0)
            return false;

        userData.password = this.hashPassword(userData.password);

        return await this.db.addDocument({
            doc: userData,
            collectionPath: "users",
        })
    }

    async getUser(username: string): Promise<User | null> {
        const userDoc = (await this.db.database.collection("users").where("username", "==", username).limit(1).get()).docs[0];
        const data = userDoc.data();
        if (!userDoc) return;

        return {
            id: userDoc.id,
            name: data.name,
            username: data.username,
            email: data.email,
            accessLevel: data.accessLevel
        }
    }

    hashPassword(password: string): string {
        if (password.length === 0) {
            return password;
        }
        else {
            // todo: use hash
            return password;
        }
    }
}
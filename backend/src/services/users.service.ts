import { User } from "../models/user.model";
import DBConnector from "./dbConnector.service";
import type dbConstants from "../constants/dbConstants";
export default class UserService {
    db: DBConnector;
    loggedInUsers: Map<string, string>;

    constructor(database : DBConnector) {
        this.db = database;
       this.loggedInUsers = new Map<string, string>();
       
    }

    //checks if user is in db using password and username/email, 
    //if so add username as key with docid as value and return user data
    //if not return user not found error
    login(username: string, password: string): boolean | User {
        if( username.length === 0 || password.length === 0){
            return false;
        }

    }

    //removes user key:value from map if available 
    logout() {

    }

    //checks for all correct credentials
    //hashes the password provided
    //adds user data to db
    async registerUser(userData : User &  {password: string}): Promise<boolean> {
        if(userData.email.length == 0 || userData.username.length == 0) 
            return false;
        
        userData.password = this.hashPassword(userData.password);
        
        return  await  this.db.addDocument({
            doc: userData,
            collectionPath: "users",
        })
    }

    hashPassword(password : string): string {
        if( password.length === 0) {
            return password;
        }
        else {
            //todo: use hash
            return password;
        }
    }
}
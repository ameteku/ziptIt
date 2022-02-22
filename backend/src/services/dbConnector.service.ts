import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import type dbConstants from '../constants/dbConstants';
import type { User } from "../models/user.model";

export default class DBConnector {
    db: FirebaseFirestore.Firestore;

    constructor() {
        const serviceAccount = require('../../../backend/zipit-23932-a77e956dd224.json');

        initializeApp({
            credential: cert(serviceAccount)
        });
        this.db = getFirestore();
    }

   async addDocument(params : { doc :Class | User | Topic | Link, collectionPath: dbConstants }) : Promise<boolean> {
        return await this.db.collection(params.collectionPath).add(params.doc).
                catch (()=> {
                       return false;
                    }
                ).then(()=> {
                    return true;
                });
    }

    async getMatchingDocuments(json : Map<string, string>, collectionPath: dbConstants): Promise<User[]> {
        const keys = Object.keys(json);
        if( keys.length == 0) return [];
       
        const values = Object.values(json);

        return this.db.collection(collectionPath).where(keys[0], "==", values[0]).get().
        then(result => {
            if( result.docs.length == 0) return null;

            return result.docs.map(item => {

                const data  = item.data();
                const tempUser =  {
                    id: item.id,
                    name: data["name"] as string,
                    username: data["username"] as string,
                    email: data["email"] as string,
                    accessLevel : data["accessLevel"] as (Array<string> | null)
                };

                return tempUser;
            });
        });
    }

    async removeDocument(params : { docId :string,  collectionPath: dbConstants }) : Promise<boolean> {
        return await this.db.collection(params.collectionPath).doc(params.docId).delete().then(result => true).catch(error => {
            return false;
        });
    }

    // todo : add check for key against objects eg. Class, user
    async updateDoc(params: {json : {} ,docId: string, collectionPath: dbConstants}) : Promise<boolean> {
        return await this.db.collection(params.collectionPath).doc(params.docId).update(params.json).then(result => {
            return true;
        }).catch(error => {
            console.log("Update error occured" + error);
            return false;
        })
    }
}



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
                ).then( ()=> {
                    return true;
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



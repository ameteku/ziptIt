import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import type dbConstants from '../constants/dbConstants';
import type { User } from "../models/user.model";

export default class DBConnector {
    private db: FirebaseFirestore.Firestore;

    constructor() {
        const serviceAccount = require('/app/dist/zipit-23932-a77e956dd224.json');

        initializeApp({
            credential: cert(serviceAccount)
        });
        this.db = getFirestore();
    }

    get database(): FirebaseFirestore.Firestore {
        return this.db;
    }

    async addDocument(params: { doc: Class | User | Topic | Link, collectionPath: dbConstants }): Promise<boolean> {
        return await this.db.collection(params.collectionPath).add(params.doc).
            catch(() => {
                return false;
            }).then(() => {
                return true;
            });
    }

    async getCollection(params: {collectionPath: dbConstants, filter?: {filterKey: string, value: string}}): Promise<object> {
        if(!params.filter) {
            return this.db.collection(params.collectionPath).get().
                then(result => {
                    if (result.docs.length === 0) return null;
                    return result.docs.map(item => { return {"id": item.id, ...item.data()}});
                });
        }

        return this.db.collection(params.collectionPath).where(params.filter.filterKey, "==", params.filter.value).get().
                then(result => {
                    if (result.docs.length === 0) return null;
                    return result.docs.map(item => { return {"id": item.id, ...item.data()}});
                });
    }

    async removeDocument(params: { docId: string, collectionPath: dbConstants }): Promise<boolean> {
        return await this.db.collection(params.collectionPath).doc(params.docId).delete().then(result => true).catch(error => {
            console.log("Error in removing doc", error);
            return false;
        });
    }

    // todo : add check for key against objects eg. Class, user
    async updateDoc(params: { json: {}, docId: string, collectionPath: dbConstants }): Promise<boolean> {
        return await this.db.collection(params.collectionPath).doc(params.docId).update(params.json).then(result => {
            return true;
        }).catch(error => {
            console.log("Update error occured" + error);
            return false;
        });
    }

    /// psth: must include collection + doc id
    async docWithIdExists(path: string): Promise<boolean> {
        return await (await this.db.doc(path).get()).exists;
    }
}



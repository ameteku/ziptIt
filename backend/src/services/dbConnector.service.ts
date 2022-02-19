import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import type dbConstants from 'src/constants/dbConstants';


class dbConnector {
    db: FirebaseFirestore.Firestore;

    constructor() {
        const serviceAccount = require('./path/to/serviceAccountKey.json');

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

    
}



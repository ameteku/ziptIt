import dbConstants from "../constants/dbConstants";
import DBConnector from "./dbConnector.service";

export default class DataService {

    db: DBConnector;

    constructor(db: DBConnector) {
        this.db = db;
    }

    addClass = async (params: { title: string, description: string }): Promise<boolean> => {
        if (params.title?.length === 0 || params.description?.length === 0) {
            throw new Error("EmptyFieldError");
        }

        const newClass: Class = {
            title: params.title,
            description: params.description,
            relatedTopicIds: []
        };

        // todo: add check for possible duplicates

        return await this.db.addDocument({
            doc: newClass,
            collectionPath: "class",
        });
    }

    addTopic = async (params: { title: string, description: string, classId: string }): Promise<boolean> => {
        if (params.title.length === 0 || params.description.length === 0) {
            throw new Error("EmptyFieldError");
        }

        //    if((await this.db.database.doc(params.classId).get()).data != null )

        const newTopic: Topic = {
            title: params.title,
            description: params.description,
            classId: params.classId,
            linkIds: []
        };

        // todo: add check for possible duplicates

        return await this.db.addDocument({
            doc: newTopic,
            collectionPath: "topics",
        });
    }

    addLink = async (params: { title: string, description: string, topicId: string, link: string, classId: string }): Promise<boolean> => {
        if (params.title.length === 0 || params.description.length === 0 || params.topicId.length === 0 || params.link) {
            throw new Error("EmptyFieldError");
        }

        // first create rating doc
        const newRatings: Ratings = {
            ratings: []
        };

        // then create link doc
        const newLink: Link = {
            title: params.title,
            description: params.description,
            topicId: params.topicId,
            classId: params.classId,
            actualLink: params.link,
            ratings: newRatings
        };

        // todo: add check for possible duplicates

        return await this.db.addDocument({
            doc: newLink,
            collectionPath: "topics",
        });
    }

    removeClass = (classId: string): Promise<boolean> => this.db.removeDocument({ docId: classId, collectionPath: "class" });

    removeTopic = (topicId: string): Promise<boolean> => this.db.removeDocument({ docId: topicId, collectionPath: "topics" });

    removeLink = (linkId: string): Promise<boolean> => this.db.removeDocument({ docId: linkId, collectionPath: "links" });

    updateLink = (newData: {}, linkId: string): Promise<boolean> => this.db.updateDoc({
        json: newData,
        docId: linkId,
        collectionPath: "links"
    });

    updateClass = (newData: {}, classId: string): Promise<boolean> => this.db.updateDoc({
        json: newData,
        docId: classId,
        collectionPath: "class"
    });

    updateTopic = (newData: {}, topicId: string): Promise<boolean> => this.db.updateDoc({
        json: newData,
        docId: topicId,
        collectionPath: "class"
    });

    getClasses = async (range?: { bottomLimit: number, upperLimit: number }): Promise<object> =>
    (await this.db.database.collection("class").get()).docs.map(record => {
        return {id: record.id,  ...record.data()}
    });

getClassTopics = async (classId: string): Promise<object> => (await this.db.database.collection("topics").where("classId", "==", classId).get()).docs.map(doc => {
    return {id: doc.id, ...doc.data()}
});

getAllTopics = async (): Promise<object> => (await this.db.database.collection("topics").get()).docs.map(doc => {
    return {id: doc.id, ...doc.data()}
});

getLinks = (topicId: string): Promise<object> => this.db.getCollection({
    collectionPath: "links",
    filter: {
        filterKey: "topicId",
        value: topicId
    }
});

// linkId, 0<=ratinng<=5
addRating = async (linkId: string, newRating: number): Promise<boolean> => {
    if (newRating >= 0 && newRating <= 5) {
        return false;
    }

    return this.db.database.collection("links").doc(linkId).get()
        .then(result => {
            const link: Link = result.data() as Link;
            link.ratings.ratings.push(newRating);
            return this.updateLink(link, linkId);
        })
        .catch(error => {
            console.log("Error getting link", error);
            return false;
        })

}
}
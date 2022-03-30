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

        // check if class being referenced exists
        if (!this.db.docWithIdExists("class/" + params.classId)) {
            console.log("class does not exist");
            return false;
        }

        // check if topic title is a duplicate
        if ((await this.db.database.collection("topics").where("title", "==", params.title).limit(1).get()).docs[0]?.exists) {
            console.log(`topic: ${params.title} is a duplicate`)
            return false;
        }

        const newTopic: Topic = {
            title: params.title,
            description: params.description,
            classId: params.classId,
            linkIds: []
        };

        return await this.db.addDocument({
            doc: newTopic,
            collectionPath: "topics",
        });

    }

    addLink = async (params: { title: string, description: string, topicId: string, link: string, classId: string }): Promise<boolean> => {
        if (params.title.length === 0 || params.description.length === 0 || params.topicId.length === 0 || !params.link) {
            console.log("empty field, please check");
            return false;
        }

        // first create rating doc
        const newRatings: Ratings = {
            ratings: []
        };

        if(!this.db.docWithIdExists("topic/" + params.topicId)) {
            console.log("topic doc being referenced does not exist");
            return false;
        }

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

    getClasses = async (range?: { bottomLimit: number, upperLimit: number }): Promise<object> => this.db.getCollection({ collectionPath: "class" });

    getClassTopics = async (classId: string): Promise<object> => this.db.getCollection({
        collectionPath: "topics",
        filter: {
            filterKey: "classId",
            value: classId
        }
    });

    getAllTopics = async (): Promise<object> => this.db.getCollection({ collectionPath: "topics" });

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
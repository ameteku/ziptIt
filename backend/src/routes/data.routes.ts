import DBConnector from "../services/dbConnector.service";
import DataService from "../services/data.service";

export default class DataRoutes {
    dataService: DataService;

    constructor(db: DBConnector) {
        this.dataService = new DataService(db);
    }

    getAllClasses = (lowerBound?: number, upperBound?: number)=> this.dataService.getClasses({
        bottomLimit: lowerBound,
        upperLimit: upperBound
    });

    addClass = (title: string, description: string ) => this.dataService.addClass({title, description});

    getTopics = (classId?: string)=> classId ? this.dataService.getClassTopics(classId) : this.dataService.getAllTopics();

    addTopic = (title: string, description: string, classId: string ) => this.dataService.addTopic({title, description, classId});

    getTopicLinks = (topicId: string) => this.dataService.getLinks(topicId);

    addLink = (title: string, description: string, classId: string, topicId: string, link: string): Promise<boolean> => this.dataService.addLink({title, description, classId, topicId, link});

    addRating = (rating: number, linkId: string) => this.dataService.addRating(linkId, rating);
}
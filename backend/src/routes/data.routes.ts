import DBConnector from "src/services/dbConnector.service";
import DataService from "../services/data.service";

export default class DataRoutes {
    dataService: DataService;

    constructor(db: DBConnector) {
        this.dataService = new DataService(db);
    }

    
}
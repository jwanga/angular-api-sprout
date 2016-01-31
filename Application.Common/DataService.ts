import {Injectable} from "angular2/core";
import {StatusService} from "../Application.Common/StatusService";
import {IPayload} from "./IPayload";
import {ReplaySubject, Observable} from "rxjs";
import {AbstractModel, IModel} from "./Model"

@Injectable()
export class DataService {
    constructor(private statusService: StatusService){
    }
    
    private database: IModel[] = [<IModel>{ 
        value: 'Release the hounds',
        done: true,
        collection: 'Todo',
        id: '1454276093756' },  
        <IModel>{ 
        value: 'Feed the rabbits',
        done: false,
        collection: 'Todo',
        id: '1454276093456' }
    ];
    
    /**
     * Creates a new record in a datastore
     * @template T The model type.
     * @param {IPayload<T>} requestPayload - A payload containing the model to be created.
     * @return {Observable<IPayload<IModel>>} An observable that resolves to a status object with a IModel json payload.
     */
    create<T extends AbstractModel>(requestPayload: IPayload<T>): Observable<IPayload<IModel>>{
        let subject = new ReplaySubject<IPayload<IModel>>(0),
            responsePayload: IPayload<IModel> = {
                sessionId: requestPayload.sessionId,
                status: this.statusService.OK
            },
            json: IModel = JSON.parse(JSON.stringify(requestPayload.data));
            json.collection = requestPayload.data.collection
        
        json.id = Date.now().toString();
        
        this.database.push(json);
        
        responsePayload.data = json;
        
        subject.next(responsePayload);
        
        subject.complete();
        
        return subject;
    }
    
     /**
     * Updates a record in a datastore
     * @template T The model type.
     * @param {IPayload<T>} requestPayload - A payload containing the model to be updated.
     * @return {Observable<IPayload<IModel>>} An observable that resolves to a status object with a IModel json payload.
     */
    update<T extends AbstractModel>(requestPayload: IPayload<T>): Observable<IPayload<IModel>>{
        let subject = new ReplaySubject<IPayload<IModel>>(0),
            responsePayload: IPayload<IModel> = {
                sessionId: requestPayload.sessionId,
                status: this.statusService.OK
            },
            json: IModel = JSON.parse(JSON.stringify(requestPayload.data)),
            index: number;
        
        
        json.collection = requestPayload.data.collection
        
        index = this.database.findIndex((record) => {
            return record.id === json.id;
        });
        
        if(index > -1) {
            this.database[index] = json;
            responsePayload.data = this.database[index];
            subject.next(responsePayload);
        } else{
            responsePayload.status = this.statusService.NotFound;
            subject.next(responsePayload);
        }
        
        
        subject.complete();
        
        return subject;
    }
    
     /**
     * gets a collection from a datastore
     * @param {IPayload<(value: IModel, index: number, array: IModel[]) => boolean>>} requestPayload - A payload containing a filter lamda to search with.
     * @return {Observable<IPayload<IModel[]>>} An observable that resolves to a status object with a IModel json payload.
     */
    get(requestPayload: IPayload<(value: IModel, index: number, array: IModel[]) => boolean>): Observable<IPayload<IModel[]>>{
        
        let subject = new ReplaySubject<IPayload<IModel[]>>(0),
            responsePayload: IPayload<IModel[]> = {
                sessionId: requestPayload.sessionId,
                status: this.statusService.OK
            },
            retrievedRecords: IModel[];
            
        
        retrievedRecords = this.database.filter(requestPayload.data);
        
        responsePayload.data = retrievedRecords;
        subject.next(responsePayload);
        
        subject.complete();
        
        return subject;
    }
}
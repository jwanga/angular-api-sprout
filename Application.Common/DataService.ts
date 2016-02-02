import {Injectable} from "angular2/core";
import {StatusService} from "../Application.Common/StatusService";
import {IPayload} from "./IPayload";
import {ReplaySubject, Subject, Observable} from "rxjs";
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
     * @param {T} model - The model to be created.
     * @return {Observable<IModel>} An observable that resolves to an IModel json payload.
     */
    create<T extends AbstractModel>(model: T): Observable<IModel>{
        let subject = new ReplaySubject<IModel>(0),
            json: IModel = JSON.parse(JSON.stringify(model));
            
        json.collection = model.collection
        
        json.id = Date.now().toString();
        
        this.database.push(json);
        
        subject.next(json);
        
        subject.complete();
        
        return subject;
    }
    
     /**
     * Updates a record in a datastore
     * @template T The model type.
     * @param {T} model - The model to be updated.
     * @return {Observable<IModel>} An observable that resolves to an IModel json payload.
     */
    update<T extends AbstractModel>(model: T): Observable<IModel>{
        let subject = new ReplaySubject<IModel>(0),
            json: IModel = JSON.parse(JSON.stringify(model)),
            index: number;
        
        
        json.collection = model.collection
        
        index = this.database.findIndex((record) => {
            return record.id === json.id;
        });
        
        if(index > -1) {
            this.database[index] = json;
            subject.next(this.database[index]);
        } else {
            subject.error(new Error('Id: ' + model.id) + ' not found');
        }
        
        subject.complete();
        
        return subject;
    }
    
     /**
     * gets a collection from a datastore
     * @param {(value: IModel, index: number, array: IModel[]) => boolean} filter - A filter lamda to search with.
     * @return {Observable<IModel[]>} An observable that resolves to an IModel array.
     */
    get(filter: (value: IModel, index: number, array: IModel[]) => boolean): Observable<IModel[]>{
        let subject = new ReplaySubject<IModel[]>(0),
            retrievedRecords: IModel[];
        
        retrievedRecords = this.database.filter(filter);
        
        subject.next(retrievedRecords);
        subject.complete();
        
        return subject;
    }
}
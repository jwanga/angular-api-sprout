import {Injectable} from "angular2/core";
import {StatusService} from "../Application.Common/StatusService";
import {IStatus} from "./IStatus";
import {ReplaySubject, Observable} from "rxjs";
import {AbstractModel, IModel} from "./Model"

@Injectable()
export class DataService {
    constructor(private statusService: StatusService<any>){
    }
    
    private database: Array<IModel> = [];
    
    /**
     * Creates a new record in a datastore
     * @template T The model type.
     * @param {T} model - The model to be created.
     * @return {Observable<IStatus<IModel>>} An observable that resolves to a status object with a IModel json payload.
     */
    create<T extends AbstractModel>(model: T): Observable<IStatus<IModel>>{
        let subject = new ReplaySubject<IStatus<IModel>>(0),
            status: IStatus<IModel>,
            json: IModel = JSON.parse(JSON.stringify(model));
    
        json.id = Date.now().toString();
        
        this.database.push(json);
        
        status = this.statusService.OK;
        status.data = json;
        
        subject.next(status);
        
        subject.complete();
        
        return subject;
    }
}
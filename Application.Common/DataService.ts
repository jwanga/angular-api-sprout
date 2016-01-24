import {Injectable} from "angular2/core";
import {StatusService} from "../Application.Common/StatusService";
import {IPayload} from "./IPayload";
import {ReplaySubject, Observable} from "rxjs";
import {AbstractModel, IModel} from "./Model"

@Injectable()
export class DataService {
    constructor(private statusService: StatusService){
    }
    
    private database: Array<IModel> = [];
    
    /**
     * Creates a new record in a datastore
     * @template T The model type.
     * @param {IPayload<Tl>} requestPayload - A payload containing the model to be created.
     * @return {Observable<IPayload<IModel>>} An observable that resolves to a status object with a IModel json payload.
     */
    create<T extends AbstractModel>(requestPayload: IPayload<T>): Observable<IPayload<IModel>>{
        let subject = new ReplaySubject<IPayload<IModel>>(0),
            responsePayload: IPayload<IModel> = {
                sessionId: requestPayload.sessionId,
                status: this.statusService.OK
            },
            json: IModel = JSON.parse(JSON.stringify(requestPayload.data));
    
        json.id = Date.now().toString();
        
        this.database.push(json);
        
        responsePayload.data = json;
        
        subject.next(responsePayload);
        
        subject.complete();
        
        return subject;
    }
}
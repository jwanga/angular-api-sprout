import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService";
import {StatusService} from "../Application.Common/StatusService";
import {IStatus} from "../Application.Common/IStatus";
import {TodoModel} from "./TodoModel";

@Injectable()
export class TodoService {
    
    constructor(private dataService: DataService, private statusService: StatusService){
    }
    
    /**
     * Creates a Todo Model.
     * @param {JSON} model The json representation of the model to be created.
     * @return {Observable<IStatus>} Resolves to an IStatus about the call.
     */
    create(json: JSON): Observable<IStatus> {
        let subject = new ReplaySubject(1),
            status: IStatus,
            model = new TodoModel(json),
            validity = model.getValidity();
            
        console.log('service update', model);
        
        if(validity.valid){ 
            status = this.statusService.OK;
        } else{
            status = this.statusService.BadRequest
            status.message = validity.message;
        }
        
        if(status.success){
            subject.next(status);
        } else {
            subject.error(status)
        }
        
        subject.complete();
            
        return subject;
    }
}
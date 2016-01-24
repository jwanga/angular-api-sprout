import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService";
import {StatusService} from "../Application.Common/StatusService";
import {IPayload} from "../Application.Common/IPayload";
import {TodoModel} from "./TodoModel";
import {AbstractModel, IModel} from "../Application.Common/Model"

@Injectable()
export class TodoService {
    
    constructor(private dataService: DataService, private statusService: StatusService){
    }
    
    
    /**
     * Creates a Todo Model.
     * @param {IPayload<any>} requestPayload - The json representation of the model to be created.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to a status object with a TodoModel payload.
     */
    create(requestPayload: IPayload<IModel>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<TodoModel>>(1),
            validationPayload: IPayload<TodoModel> = {
                sessionId: requestPayload.sessionId,
                status: this.statusService.OK,
                data: new TodoModel(requestPayload.data)
            },
            
            validity = validationPayload.data.getValidity(['value','done']);
        
        if(!validity.valid) { 
            validationPayload.status = this.statusService.BadRequest
            validationPayload.status.message = validity.message;
        }
        
        if(validationPayload && validationPayload.status && !validationPayload.status.success){
            subject.error(validationPayload)
        } else {
            this.dataService.create<TodoModel>(validationPayload).subscribe((successPayload) => {
                let model = new TodoModel(successPayload.data),
                    validity = model.getValidity(),
                    responsePayload: IPayload<TodoModel> = {
                        sessionId: successPayload.sessionId,
                        status: this.statusService.OK
                    };
                
                //If the model from the dataservice is valid, resolve a payload with the valid model.
                //Otherwise resolve a payload with an internal server error.    
                if(validity.valid){ 
                    responsePayload.status = this.statusService.OK; 
                    responsePayload.data = model; 
                    subject.next(responsePayload)
                } else {
                    responsePayload.status = this.statusService.InternalServerError
                    responsePayload.status.message = validity.message;
                    subject.error(responsePayload)
                }  
            }, (errorPayload) => {
                subject.error(errorPayload)
            }, () => {
                subject.complete();
            });
        }
            
        return subject;
    }
}

import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService";
import {StatusService} from "../Application.Common/StatusService";
import {IStatus} from "../Application.Common/IStatus";
import {TodoModel} from "./TodoModel";
import {AbstractModel, IModel} from "../Application.Common/Model"

@Injectable()
export class TodoService {
    
    constructor(private dataService: DataService, private statusService: StatusService<TodoModel>){
    }
    
    
    /**
     * Creates a Todo Model.
     * @param {IModel} model - The json representation of the model to be created.
     * @return {Observable<IStatus<TodoModel>>} An observable that resolves to a status object with a TodoModel payload.
     */
    create(json: IModel): Observable<IStatus<TodoModel>> {
        let subject = new ReplaySubject(1),
            status: IStatus<TodoModel>,
            model = new TodoModel(json),
            validity = model.getValidity(['value','done']);
        
        if(!validity.valid) { 
            status = this.statusService.BadRequest
            status.message = validity.message;
        }
        
        if(status && !status.success){
            subject.error(status)
        } else {
            this.dataService.create<TodoModel>(model).subscribe((status) => {
                let model = new TodoModel(status.data),
                    validity = model.getValidity(),
                    newStatus: IStatus<TodoModel>;
                
                //If the model from the dataservice is valid, resolve a status with the valid model.
                //Otherwise resolve a status with an internal server error.    
                if(validity.valid){ 
                    newStatus = this.statusService.OK; 
                    newStatus.data = model; 
                    subject.next(newStatus)
                } else {
                    newStatus = this.statusService.InternalServerError
                    newStatus.message = validity.message;
                    subject.error(newStatus)
                }  
            }, (status) => {
                subject.error(status)
            }, () => {
                subject.complete();
            });
        }
            
        return subject;
    }
}

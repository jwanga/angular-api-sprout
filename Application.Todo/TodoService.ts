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
    
    private validateDataservicePayload(subject: ReplaySubject<IPayload<TodoModel>>, successPayload: IPayload<IModel>): Observable<boolean>{
        let validationSubject = new ReplaySubject<boolean>(0),
            model = new TodoModel(successPayload.data),
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
            validationSubject.next(validity.valid);
        } else {
            console.error('TodoService.validateDataservicePayload', responsePayload);
            responsePayload.status = this.statusService.InternalServerError
            responsePayload.status.message = validity.message;
            subject.error(responsePayload)
            validationSubject.next(validity.valid);
        }      
        
        validationSubject.complete();
        
        return validationSubject;
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
            
            //only validate the value and done properties because new items will not yet have an id.
            validity = validationPayload.data.getValidity(['value','done']);
        
        if(!validity.valid) { 
            validationPayload.status = this.statusService.BadRequest
            validationPayload.status.message = validity.message;
        }
        
        if(validationPayload && validationPayload.status && !validationPayload.status.success){
            console.error('TodoService.create | validationPayload', validationPayload);
            subject.error(validationPayload)
        } else {
            this.dataService.create<TodoModel>(validationPayload).subscribe((successPayload) => {
                this.validateDataservicePayload(subject, successPayload); 
            }, (errorPayload) => {
                console.error('TodoService.create | errorPayload', errorPayload);
                subject.error(errorPayload)
            }, () => {
                subject.complete();
            });
        }
            
        return subject;
    }
    
    /**
     * Updates a Todo Model.
     * @param {IPayload<IModel>} requestPayload - The json representation of the model to be updated.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to a status object with a TodoModel payload.
     */
    update(requestPayload: IPayload<IModel>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<TodoModel>>(1),
            validationPayload: IPayload<TodoModel> = {
                sessionId: requestPayload.sessionId,
                status: this.statusService.OK,
                data: new TodoModel(requestPayload.data)
            },
            
            //validate all properties
            validity = validationPayload.data.getValidity();
        
        if(!validity.valid) { 
            validationPayload.status = this.statusService.BadRequest
            validationPayload.status.message = validity.message;
        }
        
        if(validationPayload && validationPayload.status && !validationPayload.status.success){
            subject.error(validationPayload)
        } else {
            this.dataService.update<TodoModel>(validationPayload).subscribe((successPayload) => {
                this.validateDataservicePayload(subject, successPayload);
            }, (errorPayload) => {
                subject.error(errorPayload)
            }, () => {
                subject.complete();
            });
        }
            
        return subject;
    }
    
     /**
     * Updates a Todo Model.
     * @param {IPayload<any>} requestPayload - An empty payload.
     * @return {Observable<IPayload<TodoModel[]>>} An observable that resolves to a payload object with a TodoModel collection of all Todos.
     */
    getAllTodos(requestPayload: IPayload<any>): Observable<IPayload<TodoModel[]>> {
        let subject = new ReplaySubject<IPayload<TodoModel[]>>(0),
             dataServicePayload: IPayload<(value: IModel, index: number, array: IModel[]) => boolean> = {
                sessionId: requestPayload.sessionId,
                status: this.statusService.OK,
                data: (model)=>{
                    return model.collection === 'Todo'; 
                }
            };
        this.dataService.get(dataServicePayload).subscribe((successPayload) => {
            let responsePayload: IPayload<TodoModel[]> = {
                    sessionId: requestPayload.sessionId,
                    status: this.statusService.OK
                };
            
           responsePayload.data = successPayload.data.map((model)=>{
               return new TodoModel(model); 
            });
            
            subject.next(responsePayload)
        }, (errorPayload) => {
            console.error('TodoService.getAllTodos', errorPayload);
            subject.error(errorPayload);
        });
        
        subject.complete();
        
        return subject;   
    }
}

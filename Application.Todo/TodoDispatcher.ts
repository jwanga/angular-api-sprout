
import {Injectable, Inject} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {TodoService} from "./TodoService";
import {TodoModel} from "./TodoModel";
import {Api, AbstractApi, Action, Event} from "../Application.Common/Api";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {StatusService} from "../Application.Common/StatusService";
import {IPayload} from "../Application.Common/IPayload";
import {IStatus} from "../Application.Common/IStatus";
import {AbstractModel, IModel} from "../Application.Common/Model"



@Api({
    route: 'todo'
})
@Injectable()
export class TodoDispatcher extends AbstractApi<TodoModel>  {
    constructor(private todoService: TodoService, private frameworkService: FrameworkService, private statusService: StatusService){
        super(frameworkService);
    }
    
    private onErrorSubject: ReplaySubject<IPayload<TodoModel>>;
    private onTodosUpdatedSubject: ReplaySubject<IPayload<TodoModel[]>>;
    
    @Event<TodoModel>({
        route: '/error'
    })
    onError(): Observable<IPayload<TodoModel>> {
        this.onErrorSubject = this.onErrorSubject || new ReplaySubject<IPayload<TodoModel>>(1);
        
        return this.onErrorSubject;
    }
    
    @Event<TodoModel>({
        route: '/updated'
    })
    onTodosUpdated(): Observable<IPayload<TodoModel[]>> {
        this.onTodosUpdatedSubject = this.onTodosUpdatedSubject || new ReplaySubject<IPayload<TodoModel[]>>(1);
        
        return this.onTodosUpdatedSubject;
    }
    
     /**
     * Initialize the session
     * @param {IPayload<any>} request - A empty payload.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to an empty payload object.
     */
    @Action<any>({
        route: '/initialize'
    })
    initialize(request: IPayload<any>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<any>>(1);
         //get all todos and retrigger the updated event
            this.todoService.getAllTodos().subscribe((getAllSuccess) => {
                
                let response: IPayload<TodoModel[]> = {
                    sessionId: request.sessionId,
                    status: this.statusService.OK,
                    data: getAllSuccess
                }
                
                this.onTodosUpdatedSubject.next(response); 
            });
        
        subject.next(null);
        
        return subject;
    }
    
    /**
     * Creates a Todo model.
     * @param {IPayload<IModel>} request - A payload containing the json representation of the model to be created.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to a payload object with a TodoModel payload.
     */
    @Action<TodoModel>({
        route: '/create'
    })
    create(request: IPayload<IModel>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<TodoModel>>(1),
            response: IPayload<TodoModel>;
            
        this.todoService.create(request.data).subscribe((success) => {
            
            response = {
                sessionId: request.sessionId,
                status: this.statusService.Created,
                data: success
            }
            
            subject.next(response);
            
            //get all todos and retrigger the updated event
            this.todoService.getAllTodos().subscribe((getAllSuccess) => {
                let response: IPayload<TodoModel[]> = {
                    sessionId: request.sessionId,
                    status: this.statusService.OK,
                    data: getAllSuccess
                }
                
                this.onTodosUpdatedSubject.next(response); 
            });
            
        }, (error) => {
            
            response = {
                sessionId: request.sessionId,
                status: this.statusService.BadRequest,
                error: <Error>error
            }
            
            console.error('TodoDispatcher.create', error);
            this.onErrorSubject.next(response)
            subject.error(response);
        }, () => {
            subject.complete();
        });
        
        return subject;
    }
    
     /**
     * Updates a Todo model.
     * @param {IPayload<IModel>} request - A payload containing the json representation of the model to be updated.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to a payload object with a TodoModel payload.
     */
    @Action<TodoModel>({
        route: '/update'
    })
    update(request: IPayload<IModel>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<TodoModel>>(1),
            response: IPayload<TodoModel>;
            
            
        this.todoService.update(request.data).subscribe((success) => {
            response = {
                sessionId: request.sessionId,
                status: this.statusService.Created,
                data: success
            }
            
            subject.next(response);
            
            //get all todos and retrigger the updated event
            this.todoService.getAllTodos().subscribe((getAllSuccess) => {
                let response: IPayload<TodoModel[]> = {
                    sessionId: request.sessionId,
                    status: this.statusService.OK,
                    data: getAllSuccess
                }
                
                this.onTodosUpdatedSubject.next(response); 
            });
            
        }, (error) => {
            
            response = {
                sessionId: request.sessionId,
                status: this.statusService.BadRequest,
                error: <Error>error
            }
            
            console.error('TodoDispatcher.update', error);
            this.onErrorSubject.next(response)
            subject.error(response);
        }, () => {
            subject.complete(); 
        });
        
        return subject;
    }
}

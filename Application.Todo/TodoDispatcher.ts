
import {Injectable, Inject} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {TodoService} from "./TodoService";
import {TodoModel} from "./TodoModel";
import {Api, AbstractApi, Action, Event} from "../Application.Common/Api";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {IPayload} from "../Application.Common/IPayload";
import {IStatus} from "../Application.Common/IStatus";
import {AbstractModel, IModel} from "../Application.Common/Model"



@Api({
    route: 'todo'
})
@Injectable()
export class TodoDispatcher extends AbstractApi<TodoModel>  {
    constructor(private todoService: TodoService, frameworkService: FrameworkService){
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
     * @param {IPayload<any>} requestPayload - A empty payload.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to an empty payload object.
     */
    @Action<any>({
        route: '/initialize'
    })
    initialize(requestPayload: IPayload<any>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<any>>(1);
        
        this.todoService.getAllTodos(requestPayload).subscribe((getAllSuccessPayload) => {
            this.onTodosUpdatedSubject.next(getAllSuccessPayload); 
        });
        
        subject.next(null);
        
        return subject;
    }
    
    /**
     * Creates a Todo model.
     * @param {IPayload<IModel>} requestPayload - A payload containing the json representation of the model to be created.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to a payload object with a TodoModel payload.
     */
    @Action<TodoModel>({
        route: '/create'
    })
    create(requestPayload: IPayload<IModel>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<TodoModel>>(1);
        
        this.todoService.create(requestPayload).subscribe((successPayload) => {
            subject.next(successPayload);
            
            //get all todos and reigger the updated event
            this.todoService.getAllTodos(successPayload).subscribe((getAllSuccessPayload) => {
                this.onTodosUpdatedSubject.next(getAllSuccessPayload); 
            });
            
        }, (errorPayload) => {
            console.error('TodoDispatcher.create', errorPayload);
            this.onErrorSubject.next(errorPayload)
            subject.error(errorPayload);
        }, () => {
            subject.complete();
        });
        
        return subject;
    }
    
     /**
     * Updates a Todo model.
     * @param {IPayload<IModel>} requestPayload - A payload containing the json representation of the model to be updated.
     * @return {Observable<IPayload<TodoModel>>} An observable that resolves to a payload object with a TodoModel payload.
     */
    @Action<TodoModel>({
        route: '/update'
    })
    update(requestPayload: IPayload<IModel>): Observable<IPayload<TodoModel>> {
        let subject = new ReplaySubject<IPayload<TodoModel>>(1);
        this.todoService.update(requestPayload).subscribe((successPayload) => {
            subject.next(successPayload);
            
            //get all todos and trigger the updated event
            this.todoService.getAllTodos(successPayload).subscribe((getAllSuccessPayload) => {
                this.onTodosUpdatedSubject.next(getAllSuccessPayload); 
            });
            
        }, (errorPayload) => {
            this.onErrorSubject.next(errorPayload)
            subject.error(errorPayload);
            console.error('TodoDispatcher.update', errorPayload);
        }, () => {
            subject.complete(); 
        });
        
        return subject;
    }
}

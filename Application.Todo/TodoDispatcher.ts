
import {Injectable, Inject} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {TodoService} from "./TodoService";
import {TodoModel} from "./TodoModel";
import {Api, AbstractApi, Action, Event} from "../Application.Common/Api";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {IPayload} from "../Application.Common/IPayload";
import {AbstractModel, IModel} from "../Application.Common/Model"



@Api({
    route: 'todo'
})
@Injectable()
export class TodoDispatcher extends AbstractApi<TodoModel>  {
    constructor(private todoService: TodoService, frameworkService: FrameworkService){
        super(frameworkService);
    }
    
    private onTodoSubject: ReplaySubject<IPayload<TodoModel>>;
    
    @Event<TodoModel>({
        route: '/changed'
    })
    onTodo(): Observable<IPayload<TodoModel>> {
        this.onTodoSubject = this.onTodoSubject || new ReplaySubject<IPayload<TodoModel>>(1);
        
        return this.onTodoSubject;
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
        
        this.todoService.create(requestPayload).subscribe((responsePayload) => {
            subject.next(responsePayload);
            this.onTodoSubject.next(responsePayload)
        }, (payload) => {
            subject.error(payload);
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
        this.todoService.update(requestPayload).subscribe((responsePayload) => {
            subject.next(responsePayload);
            this.onTodoSubject.next(responsePayload)
        }, (payload) => {
            subject.error(payload);
        }, () => {
            subject.complete();
        });
        
        return subject;
    }
}

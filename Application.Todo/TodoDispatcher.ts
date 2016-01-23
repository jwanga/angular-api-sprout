
import {Injectable, Inject} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {TodoService} from "./TodoService";
import {TodoModel} from "./TodoModel";
import {Api, AbstractApi, Action, Event} from "../Application.Common/Api";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {IStatus} from "../Application.Common/IStatus";
import {AbstractModel, IModel} from "../Application.Common/Model"



@Api({
    route: '/todo'
})
@Injectable()
export class TodoDispatcher extends AbstractApi<TodoModel>  {
    constructor(private todoService: TodoService, frameworkService: FrameworkService){
        super(frameworkService);
    }
    
    private onTodoSubject: ReplaySubject<IStatus<TodoModel>>;
    
    @Event<TodoModel>({
        route: 'todo'
    })
    onTodo(): Observable<IStatus<TodoModel>> {
        this.onTodoSubject = this.onTodoSubject || new ReplaySubject<IStatus<TodoModel>>(1);
        
        return this.onTodoSubject;
    }
    
    /**
     * Creates a Todo model.
     * @param {IModel} json - The json representation of the model be created.
     * @return {Observable<IStatus<TodoModel>>} An observable that resolves to a status object with a TodoModel payload.
     */
    @Action<TodoModel>({
        route: '/create'
    })
    create(json: IModel): Observable<IStatus<TodoModel>> {
        let subject = new ReplaySubject<IStatus<TodoModel>>(1);
        
        this.todoService.create(json).subscribe((status) => {
            subject.next(status);
            this.onTodoSubject.next(status)
            console.log(status);
        }, (status) => {
            subject.error(status);
        }, () => {
            subject.complete();
        });
        
        return subject;
    }
}

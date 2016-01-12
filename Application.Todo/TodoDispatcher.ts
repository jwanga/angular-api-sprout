
import {Injectable, Inject} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {TodoService} from "./TodoService";
import {TodoModel} from "./TodoModel";
import {Api, AbstractApi, Action} from "../Application.Common/Api";
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
    
    /**
     * Creates a Todo model.
     * @param {IModel} json - The json representation of the model be created.
     * @return {<Status<TodoModel>} A status message.
     */
    @Action<TodoModel>({
        route: '/create'
    })
    create(json: IModel): Observable<IStatus<TodoModel>> {
        let subject = new ReplaySubject<IStatus<TodoModel>>(1);
        
        this.todoService.create(json).subscribe((status) => {
            subject.next(status);
            console.log(status);
        }, (status) => {
            subject.error(status);
        }, () => {
            subject.complete();
        });
        
        return subject;
    }
}

import {Injectable, Inject} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {TodoService} from "./TodoService";
import {TodoModel} from "./TodoModel";
import {Api, AbstractApi, Action} from "../Application.Common/Api";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {IStatus} from "../Application.Common/IStatus";



@Api({
    route: '/todo'
})
@Injectable()
export class TodoDispatcher extends AbstractApi {
    constructor(private todoService: TodoService, frameworkService: FrameworkService){
        super(frameworkService);
        this.todoService = todoService;
    }
    
    /**
     * Creates a Todo model.
     * @param {JSON} json The json representation of the model be created.
     */
    @Action({
        route: '/create'
    })
    create(json: JSON): Observable<IStatus> {
        let subject = new ReplaySubject<IStatus>(1);
        
        this.todoService.create(json).subscribe((status) => {
            subject.next(status);
        }, (status) => {
            subject.error(status);
        }, () => {
            subject.complete();
        });
        
        return subject;
    }
}
import {Injectable} from "angular2/core";
import {Subject, ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService";
import {StatusService} from "../Application.Common/StatusService";
import {IPayload} from "../Application.Common/IPayload";
import {TodoModel} from "./TodoModel";
import {AbstractModel, IModel, IValidity} from "../Application.Common/Model"

@Injectable()
export class TodoService {
    
    constructor(private dataService: DataService, private statusService: StatusService){
    }
    
    /**
     * Creates a Todo Model.
     * @param {IModel} requestPayload - The json representation of the model to be created.
     * @return {Observable<TodoModel>} An observable that resolves to a TodoModel payload.
     */
    create(model: IModel): Observable<TodoModel> {
        let subject = new ReplaySubject<TodoModel>(0),
            todoModel = new TodoModel(model),
            validity: IValidity;
            
            //only validate the value and done properties because new items will not yet have an id.
            validity = todoModel.getValidity(['value','done']);
        
        if(validity.valid) {
            this.dataService.create<TodoModel>(todoModel).subscribe((success) => {
                subject.next(new TodoModel(success));
            }, (error) => {
                console.error('TodoService.create | dataService', error);
                subject.error(error);
            }, () => {
                subject.complete();
            });
        } else {
            console.error('TodoService.create | validity', validity.message);
            subject.error(new Error(validity.message));
            subject.complete();
        }
            
        return subject;
    }
    
    /**
     * Updates a Todo Model.
     * @param {IModel} requestPayload - The json representation of the model to be updated.
     * @return {Observable<TodoModel>} An observable that resolves to a TodoModel payload.
     */
    update(model: IModel): Observable<TodoModel> {
         let subject = new ReplaySubject<TodoModel>(0),
            todoModel = new TodoModel(model),
            validity: IValidity;
            
            //validate all properties.
            validity = todoModel.getValidity();
        
        if(validity.valid) {
            this.dataService.update<TodoModel>(todoModel).subscribe((success) => {
                subject.next(new TodoModel(success));
            }, (error) => {
                subject.error(error)
            }, () => {
                subject.complete();
            });
        }  else {
            console.error('TodoService.update | validity', validity.message);
            subject.error(new Error(validity.message));
            subject.complete();
        }
            
        return subject;
    }
    
     /**
     * Updates a Todo Model.
     * @return {Observable<IPayload<TodoModel[]>>} An observable that resolves to a payload object with a TodoModel collection of all Todos.
     */
    getAllTodos(): Observable<TodoModel[]> {
        let subject = new ReplaySubject<TodoModel[]>(0),
             filter: (value: IModel, index: number, array: IModel[]) => boolean  = (model)=>{
                    return model.collection === 'Todo'; 
                };
                
        this.dataService.get(filter).subscribe((success) => {
            
            let todoModels = success.map((model)=>{
               return new TodoModel(model); 
            });
            
            subject.next(todoModels);
            subject.complete();
            
        }, (error) => {
            console.error('TodoService.getAllTodos', error);
            subject.error(error);
            subject.complete();
        });
        
        
        return subject;   
    }
}

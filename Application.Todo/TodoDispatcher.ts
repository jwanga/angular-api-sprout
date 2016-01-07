
import {Injectable, Inject} from "angular2/core";
import {TodoService} from "./TodoService";
import {ITodoModel} from "./ITodoModel";
import {Api, AbstractApi, Action} from "../Application.Common/Api";
import {FrameworkService} from "../Application.Framework/FrameworkService";



@Api({
    route: '/Todo'
})
@Injectable()
export class TodoDispatcher extends AbstractApi {
    //constructor(){
    constructor(private todoService: TodoService, private FrameworkService: FrameworkService){
        super(FrameworkService);
    }
    
    /**
     * Updates or creates a Todo model
     * 
     * @param {ITodoModel} model The model to update or create.
     */
    @Action({
        route: '/Update'
    })
    Update(model: ITodoModel) {
        console.log('update', model);
    }
}
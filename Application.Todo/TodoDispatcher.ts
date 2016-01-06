import {Injectable, Inject} from "angular2/core";
import {TodoService} from "./TodoService";

@Injectable()
export class TodoDispatcher {
    //constructor(){
    constructor(private todoService: TodoService){
        console.log('TodoDispatcher constructor';
    }
    
    foo:string = 'bar';
    
    test(){
        return this.todoService;
    }
}
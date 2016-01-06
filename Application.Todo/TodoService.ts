import {Injectable} from "angular2/core";

@Injectable()
export class TodoService {
    constructor(){
        console.log('TodoService constructor');
    }
    
    foo:string = 'bars';
}
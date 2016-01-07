import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService"
import {ITodoModel} from "./ITodoModel";

@Injectable()
export class TodoService {
    
    constructor(private dataService: DataService){
    }
    
    update(model: ITodoModel): Observable<Error> {
        let subject = new ReplaySubject(1),
            error: Error;
            
        return subject;
    }
}
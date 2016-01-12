import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {IStatus} from "./IStatus";

/**
 * Defines all the statuses 
 */
@Injectable()
export class StatusService<T> {
    constructor(){
    }
    
    get OK(): IStatus<T>{
        let status: IStatus<T> = {
            code: 200,
            message: 'OK',
            success: true
        }
        
        return Object.assign({}, status);
    }
    
     get Created(): IStatus<T>{
        let status: IStatus<T> = {
            code: 201,
            message: 'Created',
            success: true
        }
        
        return Object.assign({}, status);
    }
    
    get BadRequest(): IStatus<T>{
        let status: IStatus<T> = {
            code: 400,
            message: 'Bad Request',
            success: false
        }
        
        return Object.assign({}, status);
    }
    
    get InternalServerError(): IStatus<T>{
        let status: IStatus<T> = {
            code: 500,
            message: 'Internal Server Error',
            success: false
        }
        
        return Object.assign({}, status);
    }
}
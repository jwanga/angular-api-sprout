import * as express from 'express';
import * as bodyParser from 'body-parser';

import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService";
import {IStatus} from "../Application.Common/IStatus";

/**
 * Instantiates the specific framework that will run the API
 */
@Injectable()
export class FrameworkService {
    constructor(private dataService: DataService){
        
        this.framework.use(bodyParser.json());
        
        this.framework.listen(3002, () => {
            console.log('Listen on http://localhost:3002');
        });
    }
    
    private framework = express();
    
    /**
     * Creates a new route and returns an observable that resolves when a post is made to the specified route.
     * @param {string} route The route to listen to.
     * @return {Observable<IFrameworkServiceResponse>} An observable that resolves to a IFrameworkServiceResponse.
     */
    on(route: string): Observable<IFrameworkServiceResponse> {
        
        let subject = new ReplaySubject<IFrameworkServiceResponse>(1);
        
        this.framework.route(route).post((request: any, response: any) => {
            let frameworkResponse: IFrameworkServiceResponse = {
                    body: request.body,
                    callback: (status) => {
                        let code = status.code,
                            body = {
                                message: status.message
                            };
                            
                        response.status(code).send(body);   
                    }
                }
                
            subject.next(frameworkResponse);
        });
        return subject;
    }
}

/**
 * Defines the 
 */
export interface IFrameworkServiceResponse {
    body: JSON;
    callback: (status: IStatus) => void;
}



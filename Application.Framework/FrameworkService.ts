import * as express from 'express';
import * as bodyParser from 'body-parser';

import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService"

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
     * @param {Type} T The type expected back from the post.
     * @param {string} route The route to listen to.
     * @return {Observable<T>} An observable that resolves to the generic type.
     */
    on<T>(route: string): Observable<T> {
        
        let subject = new ReplaySubject(1);
        
        this.framework.route(route).post((request: any, response: any) => {
            response.send(route);
            subject.next(request.body);
        });
        
        return subject;
    }
}



import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as io from 'socket.io';
import * as http from 'http';

import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {DataService} from "../Application.Common/DataService";
import {IStatus} from "../Application.Common/IStatus";
import {AbstractModel, IModel} from "../Application.Common/Model"

/**
 * Instantiates the specific framework that will run the API
 */
@Injectable()
export class FrameworkService {
    constructor(private dataService: DataService){
        
        this.staticServer.use(bodyParser.json()); 
         this.staticServer.use('/', express.static('./'));
        
        this.server.listen(3002, () => {
            console.log('Listen on http://localhost:3002');
        });
        
        this.socketServer.on('connection', (socket) => {
            console.log('connection');
            this.socket = socket;
        });    
        
        // setInterval(() => {
        //     if(this.socket){
        //         console.log('emit');
        //         this.socket.emit('todo', {foo:'bar'});
        //     }
        // }, 2000);
    }
    
    private staticServer = express();  
    private server = http.createServer(this.staticServer);
    private socketServer = io(this.server);
    private socket: SocketIO.Socket;
    
    /**
     * Creates a new route and returns an observable that resolves when a post is made to the specified route.
     * @param {string} route - The route to listen to.
     * @return {Observable<IFrameworkServiceResponse>} An observable that resolves to a IFrameworkServiceResponse.
     */
    registerAction<T>(route: string): Observable<IFrameworkServiceResponse<T>> {
        
        let subject = new ReplaySubject<IFrameworkServiceResponse<T>>(1);
        
        this.staticServer.route(route).post((request: any, response: any) => {
            let frameworkResponse: IFrameworkServiceResponse<T> = {
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
    
    /**
     * Publishes an event.
     * @template T
     * @param {string} route - The channel on which the event will be published.
     * @param {IStatus<T>} status - A status obbect wi a payload of type T  
     */
    publishEvent<T>(route:string, status: IStatus<T>){
        if(status.success){
            this.socket.emit(route, JSON.stringify(status.data));    
        } else{
            console.error(status);
        }
    }
}

/**
 * Defines the 
 */
export interface IFrameworkServiceResponse<T> {
    body: IModel;
    callback: (status: IStatus<T>) => void;
}



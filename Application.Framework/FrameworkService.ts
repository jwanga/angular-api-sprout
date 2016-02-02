import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as io from 'socket.io';
import * as http from 'http';

import {Injectable} from "angular2/core";
import {ReplaySubject, Observable} from "rxjs";
import {IPayload} from "../Application.Common/IPayload";
import {AbstractModel, IModel} from "../Application.Common/Model"
import {StatusService} from "../Application.Common/StatusService";

/**
 * Instantiates the specific framework that will run the API
 */
@Injectable()
export class FrameworkService {
    constructor(private statusService: StatusService){
        
        this.staticServer.use(bodyParser.json()); 
         this.staticServer.use('/', express.static('./'));
        
        this.server.listen(3002, () => {
            console.log('Listen on http://localhost:3002');
        });
        
        this.socketServer.on('connection', (socket) => {
            this.socketConnectionSubject.next(socket);
        });    
    }
    
    private staticServer = express();  
    private server = http.createServer(this.staticServer);
    private socketServer = io(this.server);
    private socketConnectionSubject = new ReplaySubject<SocketIO.Socket>(0);
    
    /**
     * Creates a new route and returns an observable that resolves when a post is made to the specified route.
     * @param {string} route - The route to listen to.
     * @return {Observable<IFrameworkServiceResponse>} An observable that resolves to a IFrameworkServiceResponse.
     */
    registerAction<T>(route: string): Observable<IPayload<T>> {
        
        let subject = new ReplaySubject<IPayload<T>>(1);
            
            //register the action after the socket has connected.
            this.socketConnectionSubject.subscribe((socket) => {
                socket.on(route, (data: any) => {
                    let payload: IPayload<any> = {
                        sessionId:socket.id,
                        status: this.statusService.OK,
                        data: data
                    }
                    
                    subject.next(payload)
                });
            });
            
        return subject;
    }
    
    /**
     * Publishes an event.
     * @template T
     * @param {string} route - The channel on which the event will be published.
     * @param {IPayload<T>} status - A payload object with a payload of type T  
     */
    publishEvent<T>(route:string, payload: IPayload<T>){
        if (this.socketServer.sockets.connected[payload.sessionId]) {
           
            //Publish to the socket matching the session in the payload.
            this.socketServer.sockets.connected[payload.sessionId].emit(route, payload.status.success ? payload.data : {status: payload.status, error: payload.error.message});     
            
        }  else {
            console.error('There is no connected socket with the id in the payload', payload);   
        }
    } 
}

/**
 * Defines the 
 */
export interface IFrameworkServiceResponse<T> {
    body: IModel;
    callback: (payload: IPayload<T>) => void;
}



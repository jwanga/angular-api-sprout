
import {IStatus} from "./IStatus";

/**
 * Describes the status of data calls within the application using HTTP status codes.
 */
export interface IPayload<T>{
    
    /**
     * The session id of this payload, this id should be set by the framework
     * and passed from actions to events. This id tracks what events belong to which
     * current sessions.
     */
    sessionId: string;
    
    /**
     * The status of this payload.
     */
    status: IStatus;
    
    /**
     * Optional data payload.
     */
    data?: T;
}

/**
 * Describes the status of data calls within the application using HTTP status codes.
 */
export interface IStatus{
    
    /**
     * The HTTP status code. The complete llist of codes is found here:
     * http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
     */
    code: number;
    
    /**
     * The custom message describing the status.
     */
    message: string;
    
    /**
     * Indicates wether the status belongs to the success class.
     */
    success: boolean;
}

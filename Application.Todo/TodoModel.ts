import {Validate, AbstractModel, PatternValidator} from "../Application.Common/Model"

export class TodoModel extends AbstractModel{
    constructor (json: JSON) {
        super(json);    
    }
    
    private _id: string;
    private _value: string;
    private _done: boolean;
    
    get id(): string {
        return this._id;
    }
    set id(value) {
        this._id = value;
    } 
    
    @Validate({
        validators: [PatternValidator(/^[a-zA-Z]+$/)],
    })
    get value(): string {
        return this._value;
    }
    set value(val) {
        this._value = val;
    } 
    
  
    get done(): boolean {
        return this._done;
    }
    set done(value) {
        this._done = value;
    } 
}

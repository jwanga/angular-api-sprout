import {Validate, AbstractModel, PatternValidator, RequiredValidator, TypeValidator} from "../Application.Common/Model"

export class TodoModel extends AbstractModel{
    constructor (json: JSON) {
        super(json);    
    }
    
    @Validate({
        validators: [
            RequiredValidator(),
            TypeValidator('string'),
            PatternValidator(/^[a-zA-Z0-9]+$/)]
    })
    id: string;
    
    @Validate({
        validators: [
            RequiredValidator(),
            TypeValidator('string')]
    })
    value: string;
    
    @Validate({
        validators: [
            RequiredValidator(),
            TypeValidator('boolean')]
    })
    done: boolean;
}

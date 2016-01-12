import {Validate, AbstractModel, IModel, PatternValidator, RequiredValidator, TypeValidator} from "../Application.Common/Model"

export class TodoModel extends AbstractModel implements IModel{
    constructor (json: IModel) {
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

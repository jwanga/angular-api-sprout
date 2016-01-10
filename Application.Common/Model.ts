
export class AbstractModel {
    constructor (json: JSON) {
        Object.keys(json).forEach((key) => {
            this[key] = (<{[index: string]: any;}>json)[key];
        })
    }
    
    validations: Array<{key: PropertyKey, valid: boolean, message: string}>;
    [index: string]: any;
    
    /**
     * returns the validity of a model and any valididation mesasges
     * @return {{valid: boolean; message: string}} An object indicating the validity of a model and any validation messages.
     */
    public getValidity () : {valid: boolean; message: string}{
        let valid: boolean, message: string = ""
        
        valid = this.validations.every((validation) => {
            if(validation.message && validation.message.length > 0){
                message += validation.message + '; '
            }
            return validation.valid;
        })
        
        return {valid: valid, message: message }
    }
}

/**
 * Defines the metadata used passed to the validator decorator.
 */
export interface IValidateMetaData{ 
    validators: Array<IValidator>
    
}

/**
 * Decorates AbstractModel setters and accepts metadate defining the validations to be perfomed
 * when the property is set.
 * @param {IValidateMetaData} metadata Defines the validations to be perfomed.
 */
export function Validate (metadata: IValidateMetaData) {
    return (target: AbstractModel, key: PropertyKey, descriptor: PropertyDescriptor) => {
        let setter = descriptor.set; 
        
        descriptor.set = function(value) {
            //store "this" as "instance" to gain type info.
            let instance: AbstractModel = this;
                
            setter.call(instance, value);
            
            instance.validations = instance.validations || [];
            
            let existingValidation = instance.validations.find((validation) => {
                return validation.key === key;
            });
            
            
            if(!existingValidation){
                existingValidation = {key :key, valid: false, message: ''}
                instance.validations.push(existingValidation);
            }
            
            //validate
            existingValidation.valid = metadata.validators.every((validator) => {
                let validity = validator(key, value);
                if(validity.message){
                    existingValidation.message = validity.message;
                }
                return validity.valid;  
            });
        }
    }
}

/**
 * Defines the signature of validator functions
 */
export interface IValidator {
        (key: PropertyKey, value: any): {valid: boolean, message: string};
}

export function PatternValidator(pattern: RegExp): IValidator {
    let validator: IValidator = (key, value) => {
        let valid: boolean, message: string;
            
            //check to ensure that te value is a string.
            if (typeof value === 'string'){
                valid = pattern.test(value);
                message = valid ? null : key.toString() + ' must match the pattern ' + pattern;
            } else {
                valid = false
                message = key.toString() + ' must be a string,'
                console.error('this field must be a string')
            }
        console.log(valid, value, pattern);
        return {valid: valid, message: message}
    }
    
    return validator;
}
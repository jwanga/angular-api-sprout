import {Type} from "angular2/core";

export class AbstractModel implements IModel {
    constructor (json: IModel) {
        let keys = Object.keys(json);
        
        if(keys) {
            keys.forEach((key) => {
                this[key] = (<{[index: string]: any;}>json)[key];
            });
        }
    }
    
    /**
     * Holds a list of all properties to be validated.
     */
    properties: Array<{key: string, metadata: IValidateMetaData}>
    
    
    /**
     * The unique identifier of this object
     */
    id: string;
    
    /**
     * The collection that this model belongs to. Should onlube set by the Queryable decorator.
     */
    collection: string;
    
    [index: string]: any;
    
    /**
     * returns the validity of a model and any valididation mesasges.
     * @param {Array<string>} properties - An optional collection of properties to validate instead of all properties.
     * @return {IValidity} An object indicating the validity of a model and any validation messages.
     */
    public getValidity (properties?: Array<string>) : IValidity{
        let valid: boolean = true, message: string = ""
        
        if(this.properties){
            this.properties.forEach((property, index) => {
                //if the properties parameter has been passed then only validate properties that appear in the properties list.
                if((properties && properties.indexOf(property.key) > -1) || ( !properties && property.metadata && property.metadata.validators)){
                    property.metadata.validators.forEach((validator) => {
                        let validity = validator(property.key, this[property.key]);
                        
                        if(validity.message && validity.message.length > 0){
                            message += validity.message  + ', '
                        }
                        
                        valid = valid && validity.valid;
                    })
                }
            })
        }
        
        return {valid: valid, message: message }
    }
}

export interface IModel{
    /**
     * A unique string that all models must have
     */
    id: string;
    
    /**
     * The collection that this model belongs to. Should onlube set by the Queryable decorator.
     */
    collection: string;
}

export interface IValidity{
    valid: boolean; 
    message: string
}

/**
 * Defines the metadata passed to the queryable decorator.
 */
export interface IQueryableMetaData{ 
    /**
     * The collection that this model belongs to.
     */
    collection: string;
    
}

/**
 * Defines the metadata passed to the validator decorator.
 */
export interface IValidateMetaData{ 
    validators: Array<IValidator>
    
}

/**
 * Defines the signature of validator functions
 */
export interface IValidator {
        (key: PropertyKey, value: any): {valid: boolean, message: string};
}

/**
 * Decorates a dispatcher and exposes it's members as a web service.
 * @param {IApiMetaData} metadata Describes the details of the action.
 */
export function Queryable (metadata: IQueryableMetaData) {
    return (target: Type) => {
        target.prototype.collection = metadata.collection;
    }
}

/**
 * Decorates AbstractModel setters and accepts metadate defining the validations to be perfomed
 * when the property is set.
 * @param {IValidateMetaData} metadata Defines the validations to be perfomed.
 */
export function Validate (metadata: IValidateMetaData) {
    return function Test(target: AbstractModel, key:PropertyKey)  { 
        let keyString = key.toString();
        target.properties = target.properties || []
        
        if(!target.properties.find((validation) => {
            return validation.key === keyString;
        })) {
            target.properties.push({key: keyString, metadata: metadata})
        }
    }
}

/**
 * Validates that a property matches the passed regular expression.
 * @param {RegExp} pattern - The regular expresion to validate the property.
 * @return {IValidator} A validator function.
 */
export function PatternValidator(pattern: RegExp): IValidator {
    let validator: IValidator = (key, value) => {
        let valid: boolean, message: string;
            if(value === null || value === undefined){
                //if the value is null or undefined it is valid because we leave null checks
                //to the required validator.
                valid = true;    
            } else {
                //check to ensure that te value is a string.
                valid = pattern.test(value);
                message = valid ? null : key.toString() + ' must match the pattern ' + pattern;
            } 
        return {valid: valid, message: message}
    }
    
    return validator;
}

/**
 * Validates that a property in not null, undefined, or an empty string.
 * @return {IValidator} A validator function.
 */
export function RequiredValidator(): IValidator {
    let validator: IValidator = (key, value) => {
        let valid: boolean, message: string;
            
            if(value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0)){
                valid = false
                message = key.toString() + ' is required'
            }else{
                valid = true;
            }
        return {valid: valid, message: message}
    }
    
    return validator;
}

/**
 * Validates that a property is of the specified type.
 * @param {string} type - The type to validate against.
 * @return {IValidator} A validator function.
 */
export function TypeValidator(type: string): IValidator {
    let validator: IValidator = (key, value) => {
        let valid: boolean, message: string;
            
            valid = typeof(value) === type;
            
            if(!valid){
                message = key.toString() + ' must be a ' + type;
            }
            
        return {valid: valid, message: message}
    }
    
    return validator;
}
import {Injector, Injectable, platform, Type, OnInit} from "angular2/core";

var Application = require('../Application.Common/Application.js');

//import {Application} from "../Application.Common/Application";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {TodoService} from "../Application.Todo/TodoService";
import {TodoDispatcher} from "../Application.Todo/TodoDispatcher";
import {ITodoModel} from "../Application.Todo/ITodoModel";

/**
 * Defines the members used in creating an API service
 */
@Injectable()
export class AbstractApi implements IApiMetaData{
    constructor(frameworkService: FrameworkService) {
       this.registerActions();
    }
    
    private registerActions () {
        this.actions.forEach((action) => {
            this.frameworkService.on<any>(this.route + action.metadata.route).subscribe((data) => {
                action.callback(data);
            }, (error) => {
                console.error('error', error);
            });
        });
    }
    
    route: string;
    frameworkService: FrameworkService;
    actions: Array<{metadata: IActionMetaData; callback: Function}>;
    [index: string]: any;
    
}

/**
 * Defines the metadata used to configure an API.
 */
export interface IApiMetaData{
    route: string;    
}

/**
 * Defines the metadata used to configure an action.
 */
export interface IActionMetaData{ 
    route: string; 
}

/**
 * Decorates a dispatcher and exposes it's members as a web service.
 * @param {IApiMetaData} metadata Describes the details of the action.
 */
export function Api (metadata: IApiMetaData) {
    return (target: Type) => {
        target.prototype.route = metadata.route;
    }
}

/**
 * Decorates a dispatcher function as an API action.
 * @param {IActionMetaData} metadata Describes the details of the action.
 */
export function Action (metadata: IActionMetaData) {
    return (target: AbstractApi, key: string, descriptor: PropertyDescriptor) => {
        
        //crate the actions collection if it doesn't exist.
        target.actions = target.actions || [];
        
        //add this action to the collection.
        target.actions.push({
            metadata: metadata,
            callback: <Function>target[key]
        });
        
        return descriptor;
    }
}


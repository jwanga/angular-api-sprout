import {Injector, Injectable, platform, Type, OnInit} from "angular2/core";

import {ReplaySubject, Observable} from "rxjs";
import {Application} from "../Application.Common/Application";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {TodoService} from "../Application.Todo/TodoService";
import {TodoDispatcher} from "../Application.Todo/TodoDispatcher";
import {TodoModel} from "../Application.Todo/TodoModel";
import {IPayload} from "../Application.Common/IPayload";

/**
 * Defines the members used in creating an API service
 * @template T
 */
export class AbstractApi<T> implements IApiMetaData{
    constructor(frameworkService: FrameworkService) {
       this.registerActions(frameworkService);
       this.registerEvents(frameworkService);
    }
    
    /**
     * Registers each action with the framework service.
     */
    private registerActions(frameworkService: FrameworkService) {
        
        this.actions.forEach((action) => {
            frameworkService.registerAction(this.route + action.metadata.route).subscribe((payload) => {
                
                (<Observable<IPayload<T>>> action.callback.call(this ,payload)).subscribe((actionPayload) => {
               
                }, (payload) => {
                    //call error on frameworkservice
                });
                
            }, (error) => {
                console.error('error', error);
            });
        });
    }
    
    /**
     * Registers each event with the framework service.
     */
    private registerEvents(frameworkService: FrameworkService) {
        this.events.forEach((event) => {
           
            (<Observable<IPayload<T>>> event.callback.call(this)).subscribe((payload) => {
                
                frameworkService.publishEvent(this.route + event.metadata.route, payload)
                
            });
        })
    }
    
    
    route: string;
    actions: Array<IAction<T>>;
    events: Array<IEvent<T>>;
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
 * Defines the metadata used to configure an event.
 */
export interface IEventMetaData{ 
    route: string; 
}

/**
 * Defines the an action.
 */
export interface IAction<T>{ 
    metadata: IActionMetaData; 
    callback: (model: JSON) =>  Observable<IPayload<T>>;
}

/**
 * Defines the an event.
 */
export interface IEvent<T>{ 
    metadata: IEventMetaData; 
    callback: () =>  Observable<IPayload<T>>;
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
export function Action<T> (metadata: IActionMetaData) {
    return (target: AbstractApi<T>, key: string, descriptor: PropertyDescriptor) => {
        
        //crate the actions collection if it doesn't exist.
        target.actions = target.actions || [];
        
        //add this action to the collection.
        target.actions.push({
            metadata: metadata,
            callback: target[key]
        });
        
        return descriptor;
    }
}

export function Event<T> (metadata: IEventMetaData){
    return (target: AbstractApi<T>, key: PropertyKey, descriptor: PropertyDescriptor) => {
        
        //crate the actions collection if it doesn't exist.
        target.events = target.events || [];
        
        
        //add this action to the collection.
        target.events.push({
            metadata: metadata,
            callback: target[key]
        });
        
        return descriptor;
    }
}

import {Injector, Injectable, platform, Type, OnInit} from "angular2/core";

import {ReplaySubject, Observable} from "rxjs";
import {Application} from "../Application.Common/Application";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {TodoService} from "../Application.Todo/TodoService";
import {TodoDispatcher} from "../Application.Todo/TodoDispatcher";
import {TodoModel} from "../Application.Todo/TodoModel";
import {IStatus} from "../Application.Common/IStatus";

/**
 * Defines the members used in creating an API service
<<<<<<< HEAD
 * @template T
=======
>>>>>>> 5d9bd19e5b7b1f163d0b35e3312c1a8af5baec50
 */
export class AbstractApi<T> implements IApiMetaData{
    constructor(frameworkService: FrameworkService) {
       this.registerActions(frameworkService);
<<<<<<< HEAD
       this.registerEvents(frameworkService);
=======
>>>>>>> 5d9bd19e5b7b1f163d0b35e3312c1a8af5baec50
    }
    
    /**
     * Registers each action with the framework service.
     */
<<<<<<< HEAD
    private registerActions(frameworkService: FrameworkService) {
        
        this.actions.forEach((action) => {
            frameworkService.registerAction(this.route + action.metadata.route).subscribe((response) => {
=======
    private registerActions (frameworkService: FrameworkService) {
        this.actions.forEach((action) => {
            frameworkService.on(this.route + action.metadata.route).subscribe((response) => {
                
>>>>>>> 5d9bd19e5b7b1f163d0b35e3312c1a8af5baec50
                
                (<Observable<IStatus<T>>> action.callback.call(this ,response.body)).subscribe((status) => {
                    response.callback(status)
                }, (status) => {
                    response.callback(status)
                });
                
            }, (error) => {
                console.error('error', error);
            });
        });
    }
    
<<<<<<< HEAD
    /**
     * Registers each event with the framework service.
     */
    private registerEvents(frameworkService: FrameworkService) {
        this.events.forEach((event) => {
           
            (<Observable<IStatus<T>>> event.callback.call(this)).subscribe((status) => {
                
                frameworkService.publishEvent(event.metadata.route, status)
                
            });
        })
    }
    
    
    route: string;
    actions: Array<IAction<T>>;
    events: Array<IEvent<T>>;
=======
    route: string;
    actions: Array<IAction<T>>;
>>>>>>> 5d9bd19e5b7b1f163d0b35e3312c1a8af5baec50
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
<<<<<<< HEAD
 * Defines the metadata used to configure an event.
 */
export interface IEventMetaData{ 
    route: string; 
}

/**
=======
>>>>>>> 5d9bd19e5b7b1f163d0b35e3312c1a8af5baec50
 * Defines the an action.
 */
export interface IAction<T>{ 
    metadata: IActionMetaData; 
    callback: (model: JSON) =>  Observable<IStatus<T>>;
}

/**
<<<<<<< HEAD
 * Defines the an event.
 */
export interface IEvent<T>{ 
    metadata: IEventMetaData; 
    callback: () =>  Observable<IStatus<T>>;
}

/**
=======
>>>>>>> 5d9bd19e5b7b1f163d0b35e3312c1a8af5baec50
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

<<<<<<< HEAD
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
=======
>>>>>>> 5d9bd19e5b7b1f163d0b35e3312c1a8af5baec50

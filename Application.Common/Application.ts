
import {platform, Injector} from "angular2/core";
import {TodoService} from "../Application.Todo/TodoService";
import {TodoDispatcher} from "../Application.Todo/TodoDispatcher";
import {FrameworkService} from "../Application.Framework/FrameworkService";
import {DataService} from "../Application.Common/DataService";
import {StatusService} from "../Application.Common/StatusService";

//Register the services we want to run as singletons.
let injector = Injector.resolveAndCreate([
    TodoDispatcher, 
    TodoService, 
    FrameworkService, 
    DataService, 
    StatusService
]);

/**
 * This class contains static members with appliaction wide cross-cutting concerns
 */
export class Application {
    static injector: Injector = injector;
}

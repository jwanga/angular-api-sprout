
//Adds reflection capabilities so we can use Decorators
//This must be at the top of the application entry file.
var reflect = require('reflect-metadata');

import {Application} from "./Application.Common/Application";
import {Injector} from "angular2/core";
import {TodoService} from "./Application.Todo/TodoService";
import {TodoDispatcher} from "./Application.Todo/TodoDispatcher";
import {FrameworkService} from "./Application.Framework/FrameworkService";
import {DataService} from "./Application.Common/DataService";
import {TodoModel} from "./Application.Todo/TodoModel";


let dataService = Application.injector.get(DataService);
dataService.foo = 'barrrr';

//let todoDispatcher = getInjector().get(TodoDispatcher);
//let frameworkService = Application.injector.get(FrameworkService);
let todoDispatcher = Application.injector.get(TodoDispatcher);

//todoDispatcher.start();

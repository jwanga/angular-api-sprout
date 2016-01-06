
//Adds reflection capabilities so we can use Decorators
//This must be at the top of the application entry file.
var reflect = require('reflect-metadata');

import {platform, reflector, Injector, Injectable} from "angular2/core";
import {TodoService} from "./Application.Todo/TodoService";
import {TodoDispatcher} from "./Application.Todo/TodoDispatcher";

let injector = Injector.resolveAndCreate([TodoDispatcher, TodoService]);
let todoDispatcher = injector.get(TodoDispatcher);

console.log(todoDispatcher.test())
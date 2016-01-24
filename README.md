# Angular API Sprout

This project is a proof-of-concept api that exploits angular dependancy injection, socketio and the dispatcher pattern
to create a scalable, reactive server for modern web applications.

## Angular?
Indeed, as it happens, angular2 has one of the most powerful dependancy injection frameworks availible to modern javascript applications. 
By ignoring the view layer of angular2, this projects uses DI build well encapsulated layers between the framework, dispatchers and services.

## SocketIo
If our aim is to build a reactive api, traditional HTTP methods (GET, POST, PUT, DELETE, ...) are a poor choice. Using socket io to publish actions and listen to events is much more natural solution.

## Dispatcher Pattern.
Frameworks like react and flux have illustrated the virtues of one-directional data flows. This project uses a dispatcher pattern to enforce one way data.
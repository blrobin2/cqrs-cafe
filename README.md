# CQRS Cafe
An exercise in applying [CQRS](https://martinfowler.com/bliki/CQRS.html) concepts written in C# to a JavaScript platform. The foundational code is in the `lib/` folder, and can probably be ported to it's own NPM package at some point. In addition to what was in the original library, I added a GUID generator, an Extendable Error so youand a Type Checker for class instatiation.

## Why?

### Why Use This?
There's no real world application for this, as you'd probably just use [Redux](http://redux.js.org/). But for people like me who came from the OOP world, seeing these concepts acted out using objects can help make explicit that separation of commands and queries.

### Why React?
The only reason the view layer with [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) is because I find it easy to scaffold things out fast in it, but there's nothing about the library itself that requires it.

### Why Not TypeScript?
I initially tried to write this in [TypeScript](https://www.typescriptlang.org/), but I found the limitations of generics not living in the runtime code made for a lot of redudancy. When I embraced the flexibility of JavaScript, I was able to get a lot done. I created a Type Checker for your DTOs, Commands, and Events, and provided example usage in OpenTab and PlaceOrder commands.

### Why In Memory Storage and Not X?
I wanted this to be easily run in the browser, without having to worry about setting up a server or anything. If you wanted to, you could write an Event Store that ties to an API or to your preferred SQL/NoSQL persistence layer and initialize it in the Domain instead of the provided Event Store.

## How it works
The index.js initializes the React stuff, Domain.js initializes the MessageDispatcher,EventStore, Aggregates, and Queries.

The EventStore holds all of the events that have happened in the system, organized by Aggregate ID. Because the provided one is in memory, it will lose all events with a screen refresh.

The Message Dispatcher consumes Aggregates and Queries, passing commands to the Aggregates set up to consume them. The Aggregate takes the command, inspects it with the domain constraints, throwing errors if the command is not consumable, and triggering events if it is. The Aggregates and Queries listen for these events and have appliers for their event on how to update themselves.

In the Aggregate, it looks for methods prepended with 'apply' for applying Events that happen in the system, and methods prepended with 'handle' for handling Commands that are dispatched.

In queries, it looks at the 'iSubscribeTo' property to determine which Events, and methods prepended with 'apply' for applying Events that happen in the system.

The queries are bound to the Domain so that we only initialize them once and they can hold the most recent state as a result of the events.

## How to use
* To play: `npm run watch`
* To test `npm test`
* To build: `npm run build`

## Acknowledgements
* Ported from [CQRS Starter Kit](https://github.com/edumentab/cqrs-starter-kit) by [Edument AB](http://www.cqrs.nu/)
* GUID generator taken from [Stack Oveflow](https://stackoverflow.com/a/2117523)
* Extendable Error based on samples from [MDN article on Errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
* Type checker inspired by [Type Safety in JavaScript using ES6 Proxies](https://medium.com/@SylvainPV/type-safety-in-javascript-using-es6-proxies-eee8fbbbd600)
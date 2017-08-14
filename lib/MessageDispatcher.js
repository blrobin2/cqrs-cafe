export default class MessageDispatcher {
  constructor(eventStore) {
    this.eventStore = eventStore
    this.commandHandlers = new Map()
    this.eventSubscribers = new Map()
  }

  sendCommand(command) {
    const commandName = command.constructor.name
    if (!this.commandHandlers.has(commandName)) {
      throw new Error(`No command handler register for ${commandName}`)
    }
    this.commandHandlers.get(commandName)(command)
  }

  _publishEvent([event]) {
    const eventName = event.constructor.name
    if (this.eventSubscribers.has(eventName)) {
      this.eventSubscribers.get(eventName).forEach(sub => sub(event))
    }
  }

  addHandlerFor(command, aggregate) {
    if (this.commandHandlers.has(command)) {
      throw new Error(`Command handler already registered for ${command}`)
    }

    this.commandHandlers.set(command, c => {
      const agg = new aggregate
      agg.id = c.id
      agg.applyEvents(this.eventStore.loadEventsFor(agg.id))

      const resultEvents = Object.getOwnPropertyNames(aggregate.prototype)
        .filter(method => method === `handle${command}`)
        .map(method => agg[method](c))

      if (resultEvents.length > 0) {
        this.eventStore.saveEventsFor(agg.id, agg.eventsLoaded, resultEvents)
      }

      resultEvents.forEach(event => this._publishEvent(event))
    })
  }

  addSubscriberFor(event, subscriber) {
    console.log(event)
    if (!this.eventSubscribers.has(event)) {
      this.eventSubscribers.set(event, [])
    }
    this.eventSubscribers.get(event).push(e =>
      subscriber[`handle${event}`](e))
  }

  scanInstance(instance) {
    const instanceMethods = this._isConstructor(instance)
      ? Object.getOwnPropertyNames(instance.prototype)
      : Object.getOwnPropertyNames(instance.constructor.prototype)
    const handlers = instanceMethods.filter(method => method.startsWith('handle'))
    handlers
      .map(handler =>
        handler.replace('handle', ''))
      .forEach(handler =>
        this.addHandlerFor(handler, instance))

    const subscribers = instance.iSubscribeTo || []
    subscribers.forEach(sub => this.addSubscriberFor(sub, instance))
  }

  _isConstructor(f) {
    try {
      new f()
    } catch(err) {
      return false
    }
    return true
  }
}
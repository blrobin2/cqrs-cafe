class Stream {
  constructor() {
    this.events = []
  }
}

export default class EventStore {
  constructor() {
    this._store = new Map()
  }

  loadEventsFor(id) {
    if(this._store.has(id)) {
      return this._store.get(id).events
    }

    return []
  }

  saveEventsFor(aggregteId, eventsLoaded, newEvents) {
    if (!this._store.has(aggregteId)) {
      this._store.set(aggregteId, new Stream)
    }

    const store = this._store.get(aggregteId)
    const eventList = store.events

    const prevEvents = eventList ? eventList.length : 0

    const newEventList = eventList ? [...eventList] : []
    newEventList.push(...newEvents)
    
    if (newEventList.filter(e => !eventList.includes(e)).length > 0) {
      this._store.get(aggregteId).events = newEventList
    }
  }
}
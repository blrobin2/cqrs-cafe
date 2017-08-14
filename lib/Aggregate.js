export default class Aggregate
{
  constructor() {
    this.eventsLoaded = 0
  }

  applyEvents(events) {
    events.forEach(event => {
      this.applyOneEvent(event)
    })
  }

  applyOneEvent(event) {
    if (Array.isArray(event)) {
      event.forEach(evt => this.applyOneEvent(evt))
      return
    }
    if (typeof this[`apply${event.constructor.name}`] === 'undefined') {
      throw new Error(`Aggregate ${this.constructor.name} does not know how to apply ${event.constructor.name}`)
    }

    this[`apply${event.constructor.name}`](event)
    this.eventsLoaded++
  }
}
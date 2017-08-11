export default class Aggregate
{
  applyEvents(events) {
    events.forEach(event => {
      this.applyOneEvent(event)
    })
  }

  applyOneEvent(event) {
    if (typeof this[`apply${event.constructor.name}`] === 'undefined') {
      throw new Error(`Aggregate ${this.constructor.name} does not know how to apply ${event.constructor.name}`)
    }

    this[`apply${event.constructor.name}`]()
    this.eventsLoaded++
  }
}
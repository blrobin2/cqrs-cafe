export default class Aggregate
{
  applyEvents(events) {
    events.forEach(event => {
      this.applyOneEvent(event)
    })
  }

  applyOneEvent(event) {
    if (typeof this[`handle${event.constructor.name}`] === 'undefined') {
      throw new Error(`Aggregate ${this.constructor.name} does not know how to apply ${event.constructor.name}`)
    }

    this[`handle${event.constructor.name}`]()
    this.eventsLoaded++
  }
}
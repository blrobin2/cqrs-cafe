import CommandHandlerNotDefinedError from  '../src/Exceptions/CommandHandlerNotDefinedError'
import { assert } from 'chai'

export default class Test {
  constructor(objectUnderTest) {
    this.sut = new objectUnderTest()
  }

  test(given, when, then) {
    then(when(this.applyEvents(this.sut, given)))
  }

  given(events) {
    return events
  }

  when(command) {
    return agg => {
      try {
        return [this.dispatchCommand(command)]
      } catch (e) {
        return e
      }
    }
  }

  then(expectedEvents) {
    return gotEvents => {
      if (typeof gotEvents !== 'undefined') {
        if (gotEvents.length === expectedEvents.length) {
          for (let i = 0; i < gotEvents.length; i++) {
            const expectedEvent = expectedEvents[i].constructor.name
            const gotEvent = gotEvents[i].constructor.name
            if (gotEvent === expectedEvent) {
              assert.deepEqual(
                this.serialize(expectedEvents[i]),
                this.serialize(gotEvents[i])
              )
            } else {
              assert.fail(`Incorrect event in result: expected a ${expectedEvent} but got a ${gotEvent}`)
            }
          }
        } else if (gotEvents.length < expectedEvents.length) {
          assert.fail(`Expected events missing: ${this.eventDiff(expectedEvents, gotEvents)}`) 
        } else {
          assert.fail(`Unexpected event(s) emitted: ${this.eventDiff(gotEvents, expectedEvents)}`)
        }
      } else if (got instanceof CommandHandlerNotDefinedError) {
        assert.fail(got.message)
      } else {
        assert.fail(`Expected events, but got exception ${got.constructor.name}`)
      }
    }
  }

  eventDiff(a, b) {
    const a_diff = a.map(e => e.constructor.name)
    const b_diff = b.map(e => e.constructor.name)
    return a_diff.filter(e => b_diff.includes(e))
  }

  dispatchCommand(command) {
    const commandName = command.constructor.name
    if (typeof this.sut[`handle${commandName}`] === 'undefined') {
      throw new CommandHandlerNotDefinedError(`Aggregate ${this.sut.constructor.name} does not yet handle ${commandName}.`)
    }

    return this.sut[`handle${commandName}`](command)
  }

  serialize(object) {
    return JSON.stringify(object)
  }

  applyEvents(aggregate, events) {
    aggregate.applyEvents(events)
    return aggregate
  }
}
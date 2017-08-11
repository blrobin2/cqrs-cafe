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
        return this.dispatchCommand(command)
      } catch (e) {
        return e
      }
    }
  }

  then(expectedEvents) {
    return gotEvents => {
      if (Array.isArray(gotEvents)) {
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
              assert.fail(null, null, `Incorrect event in result: expected a ${expectedEvent} but got a ${gotEvent}`)
            }
          }
        } else if (gotEvents.length < expectedEvents.length) {
          assert.fail(null, null, `Expected events missing: ${this.eventDiff(expectedEvents, gotEvents)}`) 
        } else {
          assert.fail(`Unexpected event(s) emitted: ${this.eventDiff(gotEvents, expectedEvents)}`)
        }
      } else if (gotEvents instanceof CommandHandlerNotDefinedError) {
        assert.fail(null, null, gotEvents.message)
      } else {
        assert.fail(null, null, `Expected events, but got exception ${gotEvents.constructor.name}`)
      }
    }
  }

  eventDiff(a, b) {
    const a_diff = a.map(e => e.constructor.name)
    const b_diff = b.map(e => e.constructor.name)
    return a_diff.filter(e => b_diff.includes(e))
  }

  thenFailWith(exception) {
    return got => {
      assert.instanceOf(got, exception)
    }
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
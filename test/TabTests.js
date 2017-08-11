import Test from './Test'
import GUID from '../src/Util/GUID'
import OpenTab from '../src/Commands/OpenTab'
import PlaceOrder from '../src/Commands/PlaceOrder'

import TabOpened from '../src/Events/TabOpened'
import TabAggregate from '../src/Aggregates/TabAggregate'

import TabNotOpen from '../src/Exceptions/TabNotOpen'

class TabTest extends Test {
  constructor() {
    super(TabAggregate)
    this.testId = GUID.newGuid()
    this.testTable = 42
    this.testWaiter = 'Derek'
  }

  canOpenANewTab() {
    this.test(
      this.given([]),
      this.when(
        new OpenTab({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        })
      ),
      this.then([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        })
      ])
    )
  }

  canNotOrderWithUnopenedTab() {
    this.test(
      this.given([]),
      this.when(new PlaceOrder({
        id: this.testId,
        items: []
      })),
      this.thenFailWith(TabNotOpen)
    )
  }
}

describe('Tab', () => {
  const tabTest = new TabTest()
  it('can open a new tab', () => {
    tabTest.canOpenANewTab()
  })
  it('cannot order without opened tab', () => {
    tabTest.canNotOrderWithUnopenedTab()
  })
})
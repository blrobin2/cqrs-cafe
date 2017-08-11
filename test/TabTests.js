import Test from './Test'
import GUID from '../src/Util/GUID'
import OpenTab from '../src/Commands/OpenTab'
import TabOpened from '../src/Events/TabOpened'
import TabAggregate from '../src/Aggregates/TabAggregate'

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
        new OpenTab(this.testId, this.testTable, this.testWaiter)
      ),
      this.then([
        new TabOpened(this.testId, this.testTable, this.testWaiter)
      ])
    )
  }
}

describe('Tab', () => {
  const tabTest = new TabTest()
  it('can open a new tab', () => {
    tabTest.canOpenANewTab()
  })
})
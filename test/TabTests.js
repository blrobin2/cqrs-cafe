import Test from './Test'
import GUID from '../src/Util/GUID'
import OpenTab from '../src/Commands/OpenTab'
import PlaceOrder from '../src/Commands/PlaceOrder'

import TabOpened from '../src/Events/TabOpened'
import DrinksOrdered from '../src/Events/DrinksOrdered'
import FoodOrdered from '../src/Events/FoodOrdered'

import OrderedItem from '../src/Domain/OrderedItem'
import TabAggregate from '../src/Aggregates/TabAggregate'

import TabNotOpen from '../src/Exceptions/TabNotOpen'

class TabTest extends Test {
  constructor() {
    super(TabAggregate)
    this.testId = GUID.newGuid()
    this.testTable = 42
    this.testWaiter = 'Derek'

    this.testDrink1 = new OrderedItem({
      menuNumber: 1,
      description: 'Coke',
      isDrink: true,
      price: 1
    })

    this.testDrink2 = new OrderedItem({
      menuNumber: 2,
      description: 'Sprite',
      isDrink: true,
      price: 2
    })

    this.testFood1 = new OrderedItem({
      menuNumber: 3,
      description: 'Hot Dog',
      isDrink: false,
      price: 4
    })

    this.testFood2 = new OrderedItem({
      menuNumber: 4,
      description: 'Hamburger',
      isDrink: false,
      price: 4
    })
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
        orderedItems: [this.testDrink1]
      })),
      this.thenFailWith(TabNotOpen)
    )
  }

  canPlaceDrinksOrder() {
    this.test(
      this.given([new TabOpened({
        id: this.testId,
        tableNumber: this.testTable,
        waiter: this.testWaiter
      })]),
      this.when(new PlaceOrder({
        id: this.testId,
        orderedItems: [this.testDrink1, this.testDrink2]
      })),
      this.then([new DrinksOrdered({
        id: this.testId,
        orderedItems: [this.testDrink1, this.testDrink2]
      })])
    )
  }

  canPlaceFoodOrder() {
    this.test(
      this.given([new TabOpened({
        id: this.testId,
        tableNumber: this.testTable,
        waiter: this.testWaiter
      })]),
      this.when(new PlaceOrder({
        id: this.testId,
        orderedItems: [ this.testFood1, this.testFood2 ]
      })),
      this.then([
        new FoodOrdered({
          id: this.testId,
          orderedItems: [ this.testFood1, this.testFood2 ]
        })
      ])
    )
  }

  canPlaceFoodAndDrinkOrder() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        })
      ]),
      this.when(new PlaceOrder({
        id: this.testId,
        orderedItems: [ this.testFood1, this.testDrink2 ]
      })),
      this.then([
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [ this.testDrink2 ]
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [ this.testFood1 ]
        })
      ])
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
  it('can place a drink order', () => {
    tabTest.canPlaceDrinksOrder()
  })
  it('can place a food order', () => {
    tabTest.canPlaceFoodOrder()
  })
  it('can place food and drink order', () => {
    tabTest.canPlaceFoodAndDrinkOrder()
  })
})
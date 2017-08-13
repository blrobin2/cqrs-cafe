import Test from '../lib/Test'
import GUID from '../lib/GUID'
import OpenTab from '../src/Commands/OpenTab'
import PlaceOrder from '../src/Commands/PlaceOrder'
import MarkDrinksServed from '../src/Commands/MarkDrinksServed'
import MarkFoodPrepared from '../src/Commands/MarkFoodPrepared'
import MarkFoodServed from '../src/Commands/MarkFoodServed'
import CloseTab from '../src/Commands/CloseTab'

import TabOpened from '../src/Events/TabOpened'
import DrinksOrdered from '../src/Events/DrinksOrdered'
import FoodOrdered from '../src/Events/FoodOrdered'
import DrinksServed from '../src/Events/DrinksServed'
import FoodPrepared from '../src/Events/FoodPrepared'
import FoodServed from '../src/Events/FoodServed'
import TabClosed from '../src/Events/TabClosed'

import OrderedItem from '../src/Domain/OrderedItem'
import TabAggregate from '../src/Aggregates/TabAggregate'

import {
  TabNotOpen,
  DrinksNotOutstanding,
  FoodNotOutstanding,
  FoodNotPrepared,
  MustPayEnough,
  TabHasUnservedItems
} from '../src/Exceptions'

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
      this.then([
        new DrinksOrdered({
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

  canNotServeAnUnorderedDrink() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink1 ]
        })
      ]),
      this.when(new MarkDrinksServed({
        id: this.testId,
        menuNumbers: [ this.testDrink2.menuNumber ]
      })),
      this.thenFailWith(DrinksNotOutstanding)
    )
  }

  canNotServeAnOrderedDrinkTwice() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink1 ]
        }),
        new DrinksServed({
          id: this.testId,
          menuNumbers: [ this.testDrink1.menuNumber ]
        })
      ]),
      this.when(new MarkDrinksServed({
        id: this.testId,
        menuNumbers: [ this.testDrink1.menuNumber ]
      })),
      this.thenFailWith(DrinksNotOutstanding)
    )
  }

  orderedDrinksCanBeServed() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink1, this.testDrink2]
        })
      ]),
      this.when(new MarkDrinksServed({
        id: this.testId,
        menuNumbers: [ this.testDrink1.menuNumber, this.testDrink2.menuNumber ]
      })),
      this.then([
        new DrinksServed({
          id: this.testId,
          menuNumbers: [ this.testDrink1.menuNumber, this.testDrink2.menuNumber ]
        })
      ])
    )
  }

  orderedFoodCanBeMarkedPrepared() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1, this.testFood1 ]
        })   
      ]),
      this.when(new MarkFoodPrepared({
        id: this.testId,
        menuNumbers: [
          this.testFood1.menuNumber,
          this.testFood1.menuNumber
        ]
      })),
      this.then([
        new FoodPrepared({
          id: this.testId,
          menuNumbers: [
            this.testFood1.menuNumber,
            this.testFood1.menuNumber
          ]
        })
      ])
    )
  }

  foodNotOrderedCannotBeMarkedPrepared() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }) 
      ]),
      this.when(new MarkFoodPrepared({
        id: this.testId,
        menuNumbers: [ this.testFood2.menuNumber ]
      })),
      this.thenFailWith(FoodNotOutstanding)
    )
  }

  canNotMarkFoodAsPreparedTwice() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1, this.testFood1 ]
        }),
        new FoodPrepared({
          id: this.testId,
          menuNumbers: [
            this.testFood1.menuNumber,
            this.testFood1.menuNumber
          ]
        })
      ]),
      this.when(new MarkFoodPrepared({
        id: this.testId,
        menuNumbers: [ this.testFood1.menuNumber ]
      })),
      this.thenFailWith(FoodNotOutstanding)
    )
  }

  canNotServeUnorderedFood() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1]
        }),
        new FoodPrepared({
          id: this.testId,
          menuNumbers: [
            this.testFood1.menuNumber
          ]
        })
      ]),
      this.when(new MarkFoodServed({
        id: this.testId,
        menuNumbers: [ this.testFood2.menuNumber ]
      })),
      this.thenFailWith(FoodNotPrepared)
    )
  }

  canNotServeOrderedButUnpreparedFood() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1]
        })
      ]),
      this.when(new MarkFoodServed({
        id: this.testId,
        menuNumbers: [ this.testFood1.menuNumber ]
      })),
      this.thenFailWith(FoodNotPrepared)
    )
  }

  preparedFoodCanBeServed() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1, this.testFood2]
        }),
        new FoodPrepared({
          id: this.testId,
          menuNumbers: [
            this.testFood1.menuNumber,
            this.testFood2.menuNumber
          ]
        })
      ]),
      this.when(new MarkFoodServed({
        id: this.testId,
        menuNumbers: [ this.testFood1.menuNumber, this.testFood2.menuNumber ]
      })),
      this.then([
        new FoodServed({
          id: this.testId,
          menuNumbers: [ this.testFood1.menuNumber, this.testFood2.menuNumber ]
        })
      ])
    )
  }

  canNotServePreparedFoodTwice() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1, this.testFood2]
        }),
        new FoodPrepared({
          id: this.testId,
          menuNumbers: [
            this.testFood1.menuNumber,
            this.testFood2.menuNumber
          ]
        }),
        new FoodServed({
          id: this.testId,
          menuNumbers: [ this.testFood1.menuNumber, this.testFood2.menuNumber ]
        })
      ]),
      this.when(new MarkFoodServed({
        id: this.testId,
        menuNumbers: [ this.testFood1.menuNumber, this.testFood2.menuNumber ]
      })),
      this.thenFailWith(FoodNotPrepared)
    )
  }

  canCloseTabByPayingExactAmount() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink1 ]
        }),
        new DrinksServed({
          id: this.testId,
          menuNumbers: [ this.testDrink1.menuNumber ]
        })        
      ]),
      this.when(new CloseTab({
        id: this.testId,
        amountPaid: this.testDrink1.price
      })),
      this.then([
        new TabClosed({
          id: this.testId,
          amountPaid: this.testDrink1.price,
          orderValue: this.testDrink1.price,
          tipValue: 0
        })
      ])
    )
  }

  canCloseTabWithTip() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink2 ]
        }),
        new DrinksServed({
          id: this.testId,
          menuNumbers: [ this.testDrink2.menuNumber ]
        })
      ]),
      this.when(new CloseTab({
        id: this.testId,
        amountPaid: this.testDrink2.price + 0.5
      })),
      this.then([
        new TabClosed({
          id: this.testId,
          amountPaid: this.testDrink2.price + 0.5,
          orderValue: this.testDrink2.price,
          tipValue: 0.5
        })
      ])
    )
  }

  mustPayEnoughToCloseTab() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink2 ]
        }),
        new DrinksServed({
          id: this.testId,
          menuNumbers: [ this.testDrink2.menuNumber ]
        })
      ]),
      this.when(new CloseTab({
        id: this.testId,
        amountPaid: this.testDrink2.price - 0.5
      })),
      this.thenFailWith(MustPayEnough)
    )
  }

  canNotCloseTabTwice() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink2 ]
        }),
        new DrinksServed({
          id: this.testId,
          menuNumbers: [ this.testDrink2.menuNumber ]
        }),
        new TabClosed({
          id: this.testId,
          amountPaid: this.testDrink2.price + 0.5,
          orderValue: this.testDrink2.price,
          tipValue: 0.5
        })
      ]),
      this.when(new CloseTab({
        id: this.testId,
        amountPaid: this.testDrink2.price
      })),
      this.thenFailWith(TabNotOpen)
    )
  }

  canNotCloseTabWithUnservedDrinkItems() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new DrinksOrdered({
          id: this.testId,
          orderedItems: [this.testDrink2 ]
        })
      ]),
      this.when(new CloseTab({
        id: this.testId,
        amountPaid: this.testDrink2.price
      })),
      this.thenFailWith(TabHasUnservedItems)
    )
  }

  canNotCloseTabWithUnpreparedFoodItems() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1 ]
        }),
      ]),
      this.when(new CloseTab({
        id: this.testId,
        amountPaid: this.testFood1.price
      })),
      this.thenFailWith(TabHasUnservedItems)
    )
  }

  canNotCloseTabWIthUnservedFoodItems() {
    this.test(
      this.given([
        new TabOpened({
          id: this.testId,
          tableNumber: this.testTable,
          waiter: this.testWaiter
        }),
        new FoodOrdered({
          id: this.testId,
          orderedItems: [this.testFood1 ]
        }),
        new FoodPrepared({
          id: this.testId,
          menuNumbers: [
            this.testFood1.menuNumber
          ]
        })
      ]),
      this.when(new CloseTab({
        id: this.testId,
        amountPaid: this.testFood1.price
      })),
      this.thenFailWith(TabHasUnservedItems)
    )
  }
}

describe('Tab', () => {
  let tabTest;

  beforeEach(() => {
    tabTest = new TabTest()
  })

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
  it('cannot serve an unordered drink', () => {
    tabTest.canNotServeAnUnorderedDrink()
  })
  it('cannot serve an ordered drink twice', () => {
    tabTest.canNotServeAnOrderedDrinkTwice()
  })
  it('can serve ordered drinks', () => {
    tabTest.orderedDrinksCanBeServed()
  })
  it('can mark ordered food as prepared', () => {
    tabTest.orderedFoodCanBeMarkedPrepared()
  })
  it('cannot mark unordered food as prepared', () => {
    tabTest.foodNotOrderedCannotBeMarkedPrepared()
  })
  it('cannot mark food as prepared twice', () => {
    tabTest.canNotMarkFoodAsPreparedTwice()
  })
  it('can serve prepared food', () => {
    tabTest.preparedFoodCanBeServed()
  })
  it('cannot serve prepared food twice', () => {
    tabTest.canNotServePreparedFoodTwice()
  })
  it('cannot serve unordered food', () => {
    tabTest.canNotServeUnorderedFood()
  })
  it('cannot serve orderd but unprepared food', () => {
    tabTest.canNotServeOrderedButUnpreparedFood()
  })
  it('can close a tab by paying exact amount', () => {
    tabTest.canCloseTabByPayingExactAmount()
  })
  it('can close a tab with tip', () => {
    tabTest.canCloseTabWithTip()
  })
  it('must pay enough to close tab', () => {
    tabTest.mustPayEnoughToCloseTab()
  })
  it('cannot close tab twice', () => {
    tabTest.canNotCloseTabTwice()
  })
  it('cannot close tab with unserved drink items', () => [
    tabTest.canNotCloseTabWithUnservedDrinkItems()
  ])
  it('cannot close tab with unprepared food items', () => {
    tabTest.canNotCloseTabWithUnpreparedFoodItems()
  })
  it('cannot close tab with served food items', () => {
    tabTest.canNotCloseTabWIthUnservedFoodItems()
  })
})
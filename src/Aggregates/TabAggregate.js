import Aggregate from './Aggregate'
import OpenTab from '../Commands/OpenTab'
import TabOpened from '../Events/TabOpened'
import DrinksOrdered from '../Events/DrinksOrdered'
import FoodOrdered from '../Events/FoodOrdered'
import DrinksServed from '../Events/DrinksServed'
import TabNotOpen from '../Exceptions/TabNotOpen'
import DrinksNotOutstanding from '../Exceptions/DrinksNotOutstanding'

export default class TabAggregate extends Aggregate
{
  constructor() {
    super()
    this.open = false;
    this.outstandingDrinks = [];
  }

  // CommandHandlers
  handleOpenTab(command) {
    if (!command instanceof OpenTab) {
      throw new Error(`Invalid command: Expected OpenTab, recieved ${command.constructor.name}`)
    }
    return [new TabOpened({
      id: command.id,
      tableNumber: command.tableNumber,
      waiter: command.waiter
    })]
  }

  handlePlaceOrder(command) {
    if (!this.open) {
      throw new TabNotOpen()
    }
    const events = []
    const drinks = command.orderedItems.filter(i => i.isDrink)
    if (drinks.length > 0) {
      events.push(new DrinksOrdered({
        id: command.id,
        orderedItems: drinks
      }))
    }

    const food = command.orderedItems.filter(i => !i.isDrink)
    if (food.length > 0) {
      events.push(new FoodOrdered({
        id: command.id,
        orderedItems: food
      }))
    }

    return events
  }

  handleMarkDrinksServed(command) {
    if (!this._areDrinksOutstanding(command.menuNumbers)) {
      throw new DrinksNotOutstanding()
    }
    return [new DrinksServed({
      id: command.id,
      menuNumbers: command.menuNumbers
    })]
  }

  // Event Appliers
  applyTabOpened(event) {
    this.open = true
  }

  applyDrinksOrdered(event) {
    this.outstandingDrinks.push(...event.orderedItems.map(i => i.menuNumber))
  }

  applyDrinksServed(event) {
    event.menuNumbers.forEach(num => {
      if (this.outstandingDrinks.includes(num)) {
        const index = this.outstandingDrinks.indexOf(num)
        this.outstandingDrinks.splice(index, 1)
      }
    })
  }

  // Helpers
  _areDrinksOutstanding(menuNumbers) {
    return this.outstandingDrinks.filter(num => menuNumbers.includes(num)).length > 0;
  }
}
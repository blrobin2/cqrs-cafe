import Aggregate from './Aggregate'
import OpenTab from '../Commands/OpenTab'
import TabOpened from '../Events/TabOpened'
import DrinksOrdered from '../Events/DrinksOrdered'
import FoodOrdered from '../Events/FoodOrdered'
import TabNotOpen from '../Exceptions/TabNotOpen'

export default class TabAggregate extends Aggregate
{
  constructor() {
    super()
    this.open = false;
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

  // Event Appliers
  applyTabOpened(event) {
    this.open = true;
  }
}
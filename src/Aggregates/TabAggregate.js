import Aggregate from './Aggregate'
import OpenTab from '../Commands/OpenTab'
import TabOpened from '../Events/TabOpened'
import DrinksOrdered from '../Events/DrinksOrdered'
import FoodOrdered from '../Events/FoodOrdered'
import DrinksServed from '../Events/DrinksServed'
import FoodServed from '../Events/FoodServed'
import TabClosed from '../Events/TabClosed'
import TabNotOpen from '../Exceptions/TabNotOpen'
import DrinksNotOutstanding from '../Exceptions/DrinksNotOutstanding'
import FoodNotOutstanding from '../Exceptions/FoodNotOutstanding'

/**
 * Representation of a Tab for an Order
 * 
 * @extends Aggregate
 */
export default class TabAggregate extends Aggregate {
  /**
   * Constructs a new TabAggregate
   */
  constructor() {
    super()
    this.open = false
    this.outstandingDrinks = []
    this.outstandingFood = []
    this.servedItemsValue = 0
  }

  /**
   * Handles OpenTab command
   * 
   * @param {OpenTab} command - The OpenTab command
   * @return {Array[TabOpened]} The events fired
   * @throws {Error}
   */
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

  /**
   * Handles PlaceOrder command
   * 
   * @param {PlaceOrder} command
   * @return {Array[DrinksOrdered|FoodOrdered]}
   * @throws {TabNotOpen} - When tab isn't open
   */
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

  /**
   * Handles MarkDrinksServed command
   * 
   * @param {MarkDrinksServed} command
   * @return {Array[DrinksServed]}
   * @throws {DrinksNotOutstanding}
   */
  handleMarkDrinksServed(command) {
    if (!this._areDrinksOutstanding(command.menuNumbers)) {
      throw new DrinksNotOutstanding()
    }
    return [new DrinksServed({
      id: command.id,
      menuNumbers: command.menuNumbers
    })]
  }

  /**
   * Handle MarkFoodServed comand
   * 
   * @param {MarkFoodServed} command
   * @return {Array[FoodServed]}
   * @throws {FoodNotOutstanding}
   */
  handleMarkFoodServed(command) {
    if (!this._isFoodOutstanding(command.menuNumbers)) {
      throw new FoodNotOutstanding()
    }
    return [new FoodServed({
      id: command.id,
      menuNumbers: command.menuNumbers
    })]
  }

  /**
   * Handles CloseTab command
   * 
   * @param {CloseTab} command
   * @return {Array[TabClosed]} 
   */
  handleCloseTab(command) {
    return [new TabClosed({
      id: command.id,
      amountPaid: command.amountPaid,
      orderValue: this.servedItemsValue,
      tipValue: command.amountPaid - this.servedItemsValue
    })]
  }

  /**
   * Applies TabOpened event
   * 
   * @param {TabOpened} event
   */
  applyTabOpened(event) {
    this.open = true
  }

  /**
   * Applies DrinksOrdered event
   * 
   * @param {DrinksOrdered} event 
   */
  applyDrinksOrdered(event) {
    this.outstandingDrinks.push(...event.orderedItems)
  }

  /**
   * Applies FoodOrdered event
   * 
   * @param {FoodOrdered} event 
   */
  applyFoodOrdered(event) {
    this.outstandingFood.push(...event.orderedItems)
  }

  /**
   * Applies DrinkServed event
   * 
   * @param {DrinksServed} event 
   */
  applyDrinksServed(event) {
    event.menuNumbers.forEach(num => {
      const itemIndex = this.outstandingDrinks.findIndex(d =>
        d.menuNumber === num)
      if (itemIndex > -1) {
        this.servedItemsValue += this.outstandingDrinks[itemIndex].price
        this.outstandingDrinks.splice(itemIndex, 1)
        
      }
    })
  }

  /**
   * Applies FoodServed event
   * 
   * @param {FoodServed} event 
   */
  applyFoodServed(event) {
    event.menuNumbers.forEach(num => {
      const itemIndex = this.outstandingFood.findIndex(d =>
        d.menuNumber === num)
      if (itemIndex > -1) {
        this.servedItemsValue += this.outstandingFood[itemIndex].price
        this.outstandingFood.splice(itemIndex, 1)
      }
    })
  }

  /**
   * Checks if there are any outstanding drinks
   * 
   * @param {Array[number]} menuNumbers
   * @return {Boolean}
   */
  _areDrinksOutstanding(menuNumbers) {
    return this.outstandingDrinks.filter(item =>
      menuNumbers.includes(item.menuNumber)).length > 0
  }

  /**
   * Checks if there is any outstanding food
   * 
   * @param {Array[number]} menuNumbers
   * @return {Boolean}
   */
  _isFoodOutstanding(menuNumbers) {
    return this.outstandingFood.filter(item =>
      menuNumbers.includes(item.menuNumber)).length > 0
  }
}
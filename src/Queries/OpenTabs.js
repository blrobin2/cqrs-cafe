class TabItem {
  constructor({menuNumber, description, price}) {
    this.menuNumber = menuNumber
    this.description = description
    this.price = price
  }
}

class TabStaus {
  constructor({tabId, tableNumber, toServe, inPreparation, served}) {
    this.tabId = tabId
    this.tableNumber = tableNumber
    this.toServe = toServe
    this.inPreparation = inPreparation
    this.served = served
  }
}

class TabInvoice {
  constructor({tabId, tableNumber, items, total, hasUnservedItems}) {
    this.tabId = tabId
    this.tableNumber = tableNumber
    this.items = items
    this.total = total
    this.hasUnservedItems = hasUnservedItems
  }
}

class Tab {
  constructor({id, tableNumber, waiter}) {
    this.id = id
    this.tableNumber = tableNumber
    this.waiter = waiter
    this.toServe = []
    this.inPreparation = []
    this.served = []
  }
}

export default class OpenTabs {
  constructor() {
    this.iSubscribeTo = [
      'DrinksOrdered',
      'DrinksServed',
      'FoodOrdered',
      'FoodPrepared',
      'FoodServed',
      'TabClosed',
      'TabOpened'
    ]
    this.todoByTab = new Map()
  }

  activeTableNumbers() {
    return Array.from(this.todoByTab).map(tab => tab.tableNumber)
  }

  todoListForWaiter(waiter) {
    return Array.from(this.todoByTab)
      .filter(tab => tab.waiter === waiter)
      .filter(tab => tab.toServe.length > 0)
  }

  tabIdForTable(table) {
    return Array.from(this.todoByTab)
      .filter(tab => tab.tableNumber === table)
      .map(tab => tab.id)[0]
  }

  tabForTable(table) {
    const tab = Array.from(this.todoByTab)
    .find(t => t.tableNumber === table)
    return new TabStatus({
      tabId: tab.id,
      tableNumber: tab.tableNumber,
      toServe: this._copyItems(tab, t => t.toServe),
      inPreparation: this._copyItems(tab, t => t.inPreparation),
      served: this._copyItems(tab, t => t.served)
    })
  }

  invoiceForTable(table) {
    const tab = Array.from(this.todoByTab).find(t => t.tableNumber === table)

    return new TabInvoice({
      taId: tab.id,
      tableNumber: tab.tableNumber,
      items: [...tab.served],
      total: tab.served.reduce((sum, item) => sum + item.price, 0),
      hasUnservedItems: (tab.inPreparation.length > 0 || tab.toServe.length > 0)
    })
  }

  handleTabOpened(event) {
    this.todoByTab.set(event.id, new Tab({
      id: event.id,
      tableNumber: event.tableNumber,
      waiter: event.waiter
    }))
  }

  handleDrinksOrdered(event) {
    this._addItems(event.id,
      event.items.map(drink => new TabItem({
        menuNumber: drink.menuNumber,
        description: drink.description,
        price: drink.price
      })),
      tab => tab.inPreparation)
  }

  handleFoodPrepared(event) {
    this._moveItems(
      event.id,
      event.menuNumbers,
      tab => tab.inPreparation,
      tab => tab.toServe)
  }

  handleDrinksServed(event) {
    this._moveItems(
      event.id,
      event.menuNumbers,
      tab => tab.toServe,
      tab => tab.served
    )
  }

  handleFoodServed(event) {
    this._moveItems(
      event.id,
      event.menuNumbers,
      tab => tab.toServe,
      tab => tab.served
    )
  }

  handleTabClosed(event) {
    const tabIndex = this.todoByTab.delete(event.id)
  }

  _getTab(id) {
    return this.todoByTab.get(id)
  }

  _addItems(tabId, newItems, to) {
    const tab = this._getTab(tabId)
    to(tab).push(...newItems)
  }

  _copyItems(tableTodo, selector) {
    return [...selector(tableTodo)]
  }

  _moveItems(tabId, menuNumbers, from, to) {
    const tab = this._getTab(tabId)
    const fromList = from(tab)
    const toList = to(tab)
    menuNumbers.forEach(num => {
      const serveItemIndex = fromList.findIndex(f => f.menuNumber === num)
      const serveItem = fromList.splice(serveItemIndex, 1)
      toList.push(serveItem)
    })
  }
}
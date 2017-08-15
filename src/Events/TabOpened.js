export default class TabOpened {
  constructor({id, tableNumber, waiter}) {
    console.log(id, tableNumber, waiter)
    this.id = id
    this.tableNumber = tableNumber
    this.waiter = waiter
  }
}

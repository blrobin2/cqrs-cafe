import { typecheck } from '../../lib/TypeCheck'

export default typecheck(class OpenTab {
  constructor({id, tableNumber, waiter}) {
    this.id = id
    this.tableNumber = tableNumber
    this.waiter = waiter
  }
}, {
  id: 'string',
  tableNumber: 'number',
  waiter: 'string'
})
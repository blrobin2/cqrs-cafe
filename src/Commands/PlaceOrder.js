import { typecheck } from '../../lib/TypeCheck'


export default typecheck(class PlaceOrder {
  constructor({id, orderedItems}) {
    this.id = id
    this.orderedItems = orderedItems
  }
}, {
  id: 'string',
  orderedItems: 'array'
})
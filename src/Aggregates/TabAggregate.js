import Aggregate from './Aggregate'
import OpenTab from '../Commands/OpenTab'
import TabOpened from '../Events/TabOpened'
import TabNotOpen from '../Exceptions/TabNotOpen'

export default class TabAggregate extends Aggregate
{
  handleOpenTab(command) {
    if (!command instanceof OpenTab) {
      throw new Error(`Invalid command: Expected OpenTab, recieved ${command.constructor.name}`)
    }
    return new TabOpened({
      id: command.id,
      tableNumber: command.tableNumber,
      waiter: command.waiter
    })
  }

  handlePlaceOrder(command) {
    throw new TabNotOpen()
  }
}
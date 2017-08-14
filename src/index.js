import MessageDispatcher from '../lib/MessageDispatcher'
import EventStore from '../lib/EventStore'
import GUID from '../lib/GUID'

import TabAggregate from './Aggregates/TabAggregate'
import OpenTab from './Commands/OpenTab'
import ChefTodoList from './Queries/ChefTodoList'
import PlaceOrder from './Commands/PlaceOrder'
import OrderedItem from './Domain/OrderedItem'

const dispatcher = new MessageDispatcher(new EventStore)
dispatcher.scanInstance(TabAggregate)

// this.openTabQueries = new OpenTabs
// this.dispatcher.scanInstance(this.openTabQueries)

const chefTodoQueries = new ChefTodoList
dispatcher.scanInstance(chefTodoQueries)

function sendOpenTab({tableNumber, waiter}) {
  const id = GUID.newGuid()
  dispatcher.sendCommand(new OpenTab({
    id: id,
    tableNumber: tableNumber,
    waiter: waiter
  }))
  dispatcher.sendCommand(new PlaceOrder({
    id: id,
    orderedItems: [ new OrderedItem({
      menuNumber: 1,
      description: 'Hot Dog',
      isDrink: false,
      price: 4
    }) ]
  }))
}

window.sendOpenTab = sendOpenTab
window.chefTodoQueries = chefTodoQueries
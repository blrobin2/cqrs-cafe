import MessageDispatcher from '../lib/MessageDispatcher'
import EventStore from '../lib/EventStore'

import TabAggregate from './Aggregates/TabAggregate'
import ChefTodoList from './Queries/ChefTodoList'
import OpenTabs from './Queries/OpenTabs'


const dispatcher = new MessageDispatcher(new EventStore)
dispatcher.scanInstance(TabAggregate)

const chefTodoQueries = new ChefTodoList
dispatcher.scanInstance(chefTodoQueries)

const openTabQueries = new OpenTabs
dispatcher.scanInstance(openTabQueries)

export {
  dispatcher, chefTodoQueries, openTabQueries
}
import MessageDispatcher from '../lib/MessageDispatcher'
import EventStore from '../lib/EventStore'

import TabAggregate from './Aggregates/TabAggregate'
import ChefTodoList from './Queries/ChefTodoList'
import OpenTabs from './Queries/OpenTabs'

class Domain {
  static setup() {
    this.dispatcher = new MessageDispatcher(new EventStore)
    this.dispatcher.scanInstance(TabAggregate)
    
    this.chefTodoQueries = new ChefTodoList
    this.dispatcher.scanInstance(this.chefTodoQueries)
    return this.dispatcher
    //this.openTabQueries = new OpenTabs
    //this.dispatcher.scanInstance(this.openTabQueries)
  }
}

export default Domain.setup()
import { Component, createElement } from 'react'
const el = createElement

import OpenTabView from './OpenTab'
import PlaceOrderView from './PlaceOrder'
import MealsToPrepareView from './MealsToPrepare'
import WaiterTodoView from './WaiterTodo'

import GUID from '../../lib/GUID'
import { dispatcher, openTabQueries, chefTodoQueries } from '../Domain'

import OpenTabCmd from '../Commands/OpenTab'
import PlaceOrderCmd from '../Commands/PlaceOrder'
import MarkFoodPrepared from '../Commands/MarkFoodPrepared'

export default class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tables: [],
      orders: []
    }

    this.handleAddTable = this.handleAddTable.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
    this.handleMarkFoodPrepared = this.handleMarkFoodPrepared.bind(this)
  }

  handleAddTable(tableNumber, waiter) {
    dispatcher.sendCommand(new OpenTabCmd({
      id: GUID.newGuid(),
      tableNumber,
      waiter
    }))
    this.setState({tables: this.state.tables.concat(tableNumber)})
  }

  handlePlaceOrder(items, tableNumber) {
    dispatcher.sendCommand(new PlaceOrderCmd({
      orderedItems: items,
      id: openTabQueries.tabIdForTable(tableNumber)
    }))
    this.setState({orders: this.state.orders.concat(tableNumber)})
  }

  handleMarkFoodPrepared(id, menuNumbers) {
    dispatcher.sendCommand(new MarkFoodPrepared({
      id: id,
      menuNumbers: menuNumbers
    }))
    this.setState({orders: this.state.orders.concat(tableNumber)})
  }

  render() {
    return el('div', {className:'container'},
      el('div', {className: 'row justify-content-md-center'},
        el('div', {className:'col-3'},
          el(OpenTabView, {
            waitStaff: this.props.waitStaff.sort(),
            handleAddTable: this.handleAddTable.bind(this)
          })
        ),
        el('div', {className:'col'},
          el(PlaceOrderView, {
            menu: this.props.menu,
            activeTableNumbers: openTabQueries.activeTableNumbers(),
            handlePlaceOrder: this.handlePlaceOrder.bind(this)
          })
        )
      ),
      el('div', {className: 'row'},
        el('div', {className: 'col'},
          el(MealsToPrepareView, {
            todoList: chefTodoQueries.getTodoList(),
            handleMarkFoodPrepared: this.handleMarkFoodPrepared.bind(this)
          })
        ),
        el('div', {className: 'col'},
          this.props.waitStaff.map(waiter =>
            el(WaiterTodoView, {
              key: waiter,
              waiter: waiter,
              todos: openTabQueries.todoListForWaiter(waiter)})
          )
        )
      )
    )
  }
}
import { Component, createElement } from 'react'
import { Link, NavLink, Switch, Route } from 'react-router-dom'
const el = createElement
import { withRouter } from 'react-router'

import NavBar from './NavBar'
import Sidebar from './Sidebar'
import HomeView from './Home'
import OpenTabView from './OpenTab'
import PlaceOrderView from './PlaceOrder'
import MealsToPrepareView from './MealsToPrepare'
import WaiterTodoView from './WaiterTodo'

import GUID from '../../lib/GUID'
import { dispatcher, openTabQueries, chefTodoQueries } from '../Domain'

import OpenTabCmd from '../Commands/OpenTab'
import PlaceOrderCmd from '../Commands/PlaceOrder'
import MarkFoodPrepared from '../Commands/MarkFoodPrepared'

class Container extends Component {
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
    this.props.history.push('/')
  }

  handleMarkFoodPrepared(id, menuNumbers) {
    dispatcher.sendCommand(new MarkFoodPrepared({
      id: id,
      menuNumbers: menuNumbers
    }))
    this.setState({orders: this.state.orders.concat(menuNumbers)})
  }

  render() {
    return el('div', null,
      el(NavBar),
      el('div', {className:'container-fluid'},
        el('div', {className: 'row justify-content-md-center'},
          el('div', {className: 'col-md-3'},
            el(Sidebar, {
              waitStaff: this.props.waitStaff,
              activeTables: openTabQueries.activeTableNumbers()
            })
          ),
          el('div', { className: 'col'},
            el(Switch, null,
              el(Route, {
                path: '/',
                exact: true,
                component: HomeView
              }),
              el(Route, {
                path: '/open-tab',
                render: () => el(OpenTabView, {
                  waitStaff: this.props.waitStaff.sort(),
                  handleAddTable: this.handleAddTable.bind(this)
                })
              }),
              el(Route, {
                path: '/chef-todo',
                render: () => el(MealsToPrepareView, {
                  todoList: chefTodoQueries.getTodoList(),
                  handleMarkFoodPrepared: this.handleMarkFoodPrepared.bind(this)
                })
              }),
              el(Route, {
                path: '/open-tabs/:tableNumber',
                render: (props) => el(PlaceOrderView, {
                  tableNumber: props.match.params.tableNumber,
                  menu: this.props.menu,
                  handlePlaceOrder: this.handlePlaceOrder.bind(this)
                })
              }),
              el(Route, {
                path: '/waiter-todo/:waiter',
                render: (props) => {
                  const waiter = props.match.params.waiter;
                  return el(WaiterTodoView, {
                  waiter: waiter,
                  todos: openTabQueries.todoListForWaiter(waiter)
                })
              }})
            )
          )
        )
      )
    )
  }
}

export default withRouter(Container)
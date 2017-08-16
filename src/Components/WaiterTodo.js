import { Component, createElement } from 'react'
const el = createElement

export default class WaiterTodo extends Component {
  render() {
    return el('div', null,
      el('h2', null, `Todo List for ${this.props.waiter}`),
      this.props.todos.map((table, index) =>
        el('div', {key: table.id},
          el('h3', null, `Table ${table.tableNumber}`),
          el('table', {className: 'table'},
            el('thead', null,
              el('tr', null,
                el('th', null, 'Menu #'),
                el('th', null, 'Description')
              )
            ),
            el('tbody', null,
              table.toServe.map((item, subIndex) =>
                el('tr', {key: subIndex},
                  el('td', null, item.menuNumber),
                  el('td', null, item.description)
                )
              )
            )
          )
        )
      )
    )
  }
}
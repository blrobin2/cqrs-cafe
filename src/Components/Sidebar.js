import { Component, createElement } from 'react'
import { Link, NavLink } from 'react-router-dom'
const el = createElement

export default class Sidebar extends Component {
  render() {
    return el('div', {className: 'card'},
      el('div', {className: 'card-body'},
        el('ul', {className: 'nav flex-column'},
          el('li', null, 'Wait Staff Todo List'),
          this.props.waitStaff.map(waiter =>
            el('li', { className: 'nav-item', key: waiter },
              el(NavLink, {
                  to: `/waiter-todo/${waiter}`,
                  className: 'nav-link',
                  activeClassName: 'active'
                }, waiter)
            )
          ),
          el('li', null, 'Open Tabs'),
          this.props.activeTables.map(table =>
            el('li', { className: 'nav-item', key: table },
              el(NavLink, {
                to: `/open-tabs/${table}`,
                className: 'nav-link',
                activeClassName: 'active'
              }, table)
            )
          )
        )
      )
    )
  }
}
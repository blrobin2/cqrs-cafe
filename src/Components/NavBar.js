import { Component, createElement } from 'react'
import { Link, NavLink } from 'react-router-dom'
const el = createElement

export default class NavBar extends Component {
  render() {
    return el('nav', {
        className: 'navbar navbar-expand-md navbar-dark bg-dark fixed-top'
      },
      el(Link, { to: '/', className: 'navbar-brand' }, 'Cafe'),
      el('button', {
          className: 'navbar-toggler',
          type: 'button',
          'data-toggle': 'collapse',
          'data-target': '#navbar',
          'aria-controls': 'navbar',
          'aria-expanded': false,
          'aria-label': 'Toggle navigation'
        },
        el('span', { className: 'navbar-toggler-icon' })
      ),
      el('div', {
          className: 'collapse navbar-collapse',
          id: 'navbar'
        },
        el('ul', { className: 'navbar-nav mr-auto' },
          el('li', { className: 'nav-item'},
            el(NavLink, {
                exact: true,
                className: 'nav-link',
                activeClassName: 'active',
                to: '/'
              }, 'Home'
            )
          ),
          el('li', { className: 'nav-item'},
            el(NavLink, {
                className: 'nav-link',
                activeClassName: 'active',
                to: '/open-tab'
              }, 'Open Tab'
            )
          ),
          el('li', { className: 'nav-item'},
            el(NavLink, {
                className: 'nav-link',
                activeClassName: 'active',
                to: '/chef-todo'
              }, 'Chef Todo List')
          )
        )
      )
    )
  }
}
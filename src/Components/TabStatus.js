import { Component, createElement } from 'react'
import { Link } from 'react-router-dom'
const el = createElement

export default class TabStatus extends Component {
  constructor(props) {
    super(props)

    this.handleChangeServed = this.handleChangeServed.bind(this)
    this.handleMarkItemsServed = this.handleMarkItemsServed.bind(this)
    this._buildState = this._buildState.bind(this)

    this.state = this._buildState()
  }

  _buildState() {
    return this.props.tab.toServe.reduce((obj, item, i) => {
      obj[`${item.menuNumber}-${i}`] = false
      return obj
    }, {})
  }

  handleChangeServed(event) {
    const {menuNumber, index} = event.target.dataset
    const newState = Object.assign({}, this.state)
    newState[`${menuNumber}-${index}`] = event.target.checked
    this.setState(newState)
  }

  handleMarkItemsServed(event) {
    event.preventDefault()
    const menuNumbers = Object.keys(this.state)
      .filter(menuNumber => this.state[`${menuNumber}`])
      .map(menuNumberPlusIndex => menuNumberPlusIndex.split('-')[0])
      .map(menuNumbers => parseInt(menuNumbers))
    this.props.handleMarkItemsServed(this.props.tab.tabId, menuNumbers)
    this.setState(this._buildState())
  }

  render() {
    return el('div', null,
      el('h2', null, `Tab for Table ${this.props.tab.tableNumber}`),
      el('div', null,
        el(Link, {
            to: `/close-table/${this.props.tab.tableNumber}`
          },
          'Close Table'
        )
      ),
      el('div', null,
        el(Link, {
            to: `/order-food/${this.props.tab.tableNumber}`
          },
          'Order Food/Drink'
        )
      ),
      this.props.tab.toServe.length ? el('form', { onSubmit: this.handleMarkItemsServed },
        el('h3', null, 'Items to Serve'),
        el('table', {className: 'table'},
          el('thead', null,
            el('tr', null,
              el('th', null, 'Menu #'),
              el('th', null, 'Description'),
              el('th', null, 'Mark Served')
            )
          ),
          el('tbody', null,
            this.props.tab.toServe.map((item, index) =>
              el('tr', {key: index},
                el('td', null, item.menuNumber),
                el('td', null, item.description),
                el('td', null,
                  el('input', {
                    type: 'checkbox',
                    name: `prepared_${item.menuNumber}_${index}`,
                    onChange: this.handleChangeServed,
                    'data-menu-number': item.menuNumber,
                    'data-index': index,
                    checked: this.state[`${item.menuNumber}-${index}`]
                  })
                )
              )
            )        
          )
        ),
        el('button', {
          type: 'submit',
          className: 'btn'
        }, 'Mark Served')
      ) : '',
      this.props.tab.inPreparation.length ? el('form', null,
        el('h3', null, 'Food in Preparation'),
        el('table', {className: 'table'},
          el('thead', null,
            el('tr', null,
              el('th', null, 'Menu #'),
              el('th', null, 'Description')
            )
          ),
          el('tbody', null,
            this.props.tab.inPreparation.map((item, index) =>
              el('tr', {key: index},
                el('td', null, item.menuNumber),
                el('td', null, item.description)
              )
            )
          )
        )
      ) : '',
      this.props.tab.served.length ? el('form', null,
        el('h3', null, 'Items Already Served'),
        el('table', {className: 'table'},
          el('thead', null,
            el('tr', null,
              el('th', null, 'Menu #'),
              el('th', null, 'Description')
            )
          ),
          el('tbody', null,
            this.props.tab.served.map((item, index) =>
              el('tr', {key: index},
                el('td', null, item.menuNumber),
                el('td', null, item.description)
              )
            )
          )
        )
      ) : ''
    )
  }
}

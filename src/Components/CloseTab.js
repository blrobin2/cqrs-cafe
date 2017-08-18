import { Component, createElement } from 'react'
const el = createElement

export default class CloseTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountPaid: 0
    }

    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleCloseTab = this.handleCloseTab.bind(this)
  }

  handleAmountChange(event) {
    this.setState({ amountPaid: event.target.value })
  }

  handleCloseTab(event) {
    event.preventDefault()
    this.props.handleCloseTab(this.props.invoice.tabId, this.state.amountPaid)
  }

  render() {
    return el('div', null,
      el('h2', null, 'Close Tab'),
      el('table', {className: 'table'},
        el('thead', null,
          el('tr', null,
            el('th', null, 'Item'),
            el('th', null, 'Price')
          )
        ),
        el('tbody', null,
          this.props.invoice.items.map((item, index) =>
            el('tr', {key: index},
              el('td', null, item.description),
              el('td', null, `$${item.price.toFixed(2)}`),
            )
          ),
          el('tr', null,
            el('td', null, 'Total'),
            el('td', null, `$${this.props.invoice.total.toFixed(2)}`)
          )
        )
      ),
      this.props.invoice.hasUnservedItems
      ? el('h3', null, 'Note: Invoice has unserved items and cannot be closed')
      : el('form', { onSubmit: this.handleCloseTab },
        el('input', {type: 'hidden', value: this.props.invoice.tabId }),
        el('div', {className: 'form-group'},
          el('label', {htmlFor: 'amountPaid'}, 'Amount Paid'),
          el('div', { className: 'input-group'},
            el('span', { className: 'input-group-addon'}, '$'),
            el('input', {
              type: 'number',
              step: '0.01',
              min: '0.00',
              name: 'amountPaid',
              id: 'amountPaid',
              className: 'form-control',
              value: this.state.amountPaid,
              onChange: this.handleAmountChange
            })
          )
        ),
        el('button', {
          type: 'submit',
          className: 'btn'
        }, 'Close Tab')
      )
    )
  }
}
import { Component, createElement } from 'react'
const el = createElement

export default class OpenTab extends Component {
  constructor(props) {
    super(props)
    this.initialState = {
      tableNumber: 0,
      waiter: ''
    }
    this.state = this.initialState

    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleWaiterChange = this.handleWaiterChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleTableChange({target: {value: tableNumber}}) {
    this.setState({tableNumber})
  }

  handleWaiterChange({target: {value: waiter}}) {
    this.setState({waiter})
  }  

  handleSubmit(event) {
    event.preventDefault()
    const {tableNumber, waiter} = this.state
    this.setState(this.initialState)
    if (tableNumber === 0 || waiter === '') {
      alert('FILL OUT THE FORM')
      return
    }
    this.props.handleAddTable(tableNumber, waiter)
  }
  render() {
    return el('div', null,
      el('h2', null, 'Open Tab'),
      el('form', {
          id: 'openTab',
          onSubmit: this.handleSubmit
        },
        el('fieldset', null,
          el('div', {className: 'form-group'},
            el('label', {htmlFor: 'tableNumber'}, 'Table Number'),
            el('input', {
              type: 'number',
              name: 'tableNumber',
              id: 'tableNumber',
              className: 'form-control',
              value: this.state.tableNumber,
              onChange: this.handleTableChange
            }),
          ),
          el('div', {className: 'form-group'},
            el('label', {htmlFor: 'waiter'}, 'Waiter/Waitress'),
            el('select', {
                name: 'waiter',
                id: 'waiter',
                className: 'form-control',
                value: this.state.waiter,
                onChange: this.handleWaiterChange
              },
              el('option', {value: 0, key: -1}, '--Select--'),
              this.props.waitStaff.map((w, i) =>
                el('option', {value: w, key: i}, w))
            ),
          ),
          el('button', {
              type: 'submit',
              className: 'btn'
            }, 'Submit')
        )
      )
    )
  }
}
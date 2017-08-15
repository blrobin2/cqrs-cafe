import OpenTabCmd from '../Commands/OpenTab'
import GUID from '../../lib/GUID'
import { dispatcher } from '../Domain'

export default class OpenTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableNumber: 0,
      waiter: ''
    }

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
    if (tableNumber === 0 || waiter === '') {
      alert('FILL OUT THE FORM')
      return
    }
    dispatcher.sendCommand(new OpenTabCmd({
      id: GUID.newGuid(),
      tableNumber,
      waiter
    }))
  }
  render() {
    const el = React.createElement
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
              type: 'text',
              name: 'tableNumber',
              id: 'tableNumber',
              className: 'form-control',
              value: this.state.value,
              onChange: this.handleTableChange
            }),
          ),
          el('div', {className: 'form-group'},
            el('label', {htmlFor: 'waiter'}, 'Waiter/Waitress'),
            el('select', {
                name: 'waiter',
                id: 'waiter',
                className: 'form-control',
                value: this.state.value,
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
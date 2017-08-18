import { Component, createElement } from 'react'
import OrderedItem from '../Domain/OrderedItem'

const el = createElement

export default class PlaceOrder extends Component {
  constructor(props) {
    super(props)
    this.initialState = this.props.menu.reduce((obj, item) => {
      obj[item.menuNumber] = 0
      return obj
    }, {})

    this.state = this.initialState

    this.handleChangeAmount = this.handleChangeAmount.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
  }

  handleChangeAmount(event) {
    this.setState({
      [event.target.id]: parseInt(event.target.value)
    })
  }

  handlePlaceOrder(event) {
    event.preventDefault()
    const order = this.props.menu
      .filter(item => this.state[item.menuNumber] > 0)
      .reduce((orderedItems, item) => {
        const newItems = []
        for (let i = 0; i < this.state[item.menuNumber]; i++) {
          newItems.push(new OrderedItem({
            menuNumber: item.menuNumber,
            description: item.description,
            isDrink: item.isDrink,
            price: item.price
          }))
        }
        return orderedItems.concat(newItems)
      }, [])
    
    this.props.handlePlaceOrder(order, this.props.tableNumber)
    this.setState(this.initialState)
  }

  render() {
    return el('form', {onSubmit: this.handlePlaceOrder},
      el('h2', null, 'Place Order'),
      el('table', {className: 'table'},
        el('thead', null,
          el('tr', null,
            el('th', null, 'Menu #'),
            el('th', null, 'Description'),
            el('th', null, 'Price'),
            el('th', null, '# Order')
          )
        ),
        el('tbody', null,
          this.props.menu.map(i =>
            el('tr', {key: i.menuNumber},
              el('td', null,
                i.menuNumber,
                el('input', {type: 'hidden', value: i.menuNumber})
              ),
              el('td', null, i.description),
              el('td', null, `$${i.price.toFixed(2)}`),
              el('td', null,
                el('input', {
                  type: 'number',
                  min: '0',
                  max: '50',
                  id: i.menuNumber,
                  name: 'numberToOrder',
                  value: this.state[i.menuNumber],
                  className: 'form-control',
                  onChange: this.handleChangeAmount
                })
              )
            )
          )
        )
      ),
      el('button', {type: 'submit', className: 'btn'}, 'Place Order')
    )
  }
}
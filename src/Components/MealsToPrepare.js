import { Component, createElement } from 'react'
const el = createElement

export default class MealsToPrepare extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.handlePrepareFood = this.handlePrepareFood.bind(this)
    this.handleChangePrepared = this.handleChangePrepared.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const state = nextProps.todoList.reduce((obj, group) => {
      obj[group.tab] = group.items.reduce((obj2, item, i) => {
        obj2[`${item.menuNumber}-${i}`] = false
        return obj2
      }, {})
      return obj
    }, {})

    this.setState(state)
  }

  handleChangePrepared(event) {
    const {group, menuNumber, index} = event.target.dataset
    const newState = Object.assign({}, this.state)
    newState[group][`${menuNumber}-${index}`] = event.target.checked
    this.setState(newState)
  }

  handlePrepareFood(event) {
    event.preventDefault()
    const id = event.target.id.value
    const menuNumbers = Object.keys(this.state[id])
      .filter(menuNumber => this.state[id][`${menuNumber}`])
      .map(menuNumberPlusIndex => menuNumberPlusIndex.split('-')[0])
    this.props.handleMarkFoodPrepared(id, menuNumbers)
  }

  render() {
    return el('div', null,
      el('h2', null, 'Meals to Prepare'),
      this.props.todoList.map((group, index) =>
        el('form', {key: index, onSubmit: this.handlePrepareFood},
          el('input', {
            type: 'hidden',
            name: 'id',
            value: group.tab
          }),
          el('table', {className: 'table'},
            el('thead', null,
              el('tr', null,
                el('th', null, 'Menu #'),
                el('th', null, 'Description'),
                el('th', null, 'Prepared')
              )
            ),
            el('tbody', null,
              group.items.map((item, subIndex) =>
                el('tr', {key: subIndex},
                  el('td', null, item.menuNumber),
                  el('td', null, item.description),
                  el('td', null,
                    el('input', {
                      type: 'checkbox',
                      name: `prepared_${group.tab}_${item.menuNumber}_${subIndex}`,
                      onChange: this.handleChangePrepared,
                      'data-group': group.tab,
                      'data-menu-number': item.menuNumber,
                      'data-index': subIndex,
                      checked: this.state[group.tab][`${item.menuNumber}-${subIndex}`]
                    })
                  )
                )
              )
            )
          ),
          el('button', {
            type: 'submit',
            className: 'btn'
          }, 'Mark Prepared')
        )
      )
    )
  }
}
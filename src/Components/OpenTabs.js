import { Component, createElement } from 'react'
const el = createElement

export default class OpenTabs extends Component {
  render() {
    return el('div', null,
      el('h2', null, 'Open Tabs'),
      el('ul', null,
        this.props.activeTableNumbers.map((t, i) => el('li', {key: i}, t))
      )
    )
  }
}
import { Component, createElement } from 'react'
const el = createElement

export default class Home extends Component {
  render() {
    return el('h2', null, 'What do you want to do?')
  }
}
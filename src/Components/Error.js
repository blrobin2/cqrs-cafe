import { Component, createElement } from 'react'
const el = createElement

export default class Error extends Component {
  render() {
    return el('h2', null, 'Sorry, an error occurred processing your request')
  }
}
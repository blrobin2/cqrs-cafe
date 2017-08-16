import { createElement } from 'react'
import { render }from 'react-dom'

import ContainerView from './Components/Container'

const waitStaff = [
  'Carl',
  'Meghan',
  'Dave',
  'Brittney'
]

const menu = [{
  menuNumber: 1,
  description: 'Coke',
  price: 1.5,
  isDrink: true
},{
  menuNumber: 10,
  description: 'Mushroom and Bacon Pasta',
  price: 6,
  isDrink: false
}]

const el = createElement
render(
  el(ContainerView, {
    waitStaff, menu
  }),
  document.getElementById('root')
)
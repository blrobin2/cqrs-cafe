import { createElement } from 'react'
import { render }from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import ContainerView from './Components/Container'

const waitStaff = [
  'Brittney',
  'Carl',
  'Dave',
  'Meghan',
]

const menu = [{
  menuNumber: 1,
  description: 'Coke',
  price: 1.5,
  isDrink: true
},{
  menuNumber: 2,
  description: 'Green Tea',
  price: 1.9,
  isDrink: true
},{
  menuNumber: 3,
  description: 'Freshly Ground Coffee',
  price: 2,
  isDrink: true
},{
  menuNumber: 4,
  description: 'Czech Pilsner',
  price: 3.5,
  isDrink: true
},{
  menuNumber: 5,
  description: 'Yeti Stout',
  price: 4.5,
  isDrink: true
},{
  menuNumber: 10,
  description: 'Mushroom and Bacon Pasta',
  price: 6,
  isDrink: false
},{
  menuNumber: 11,
  description: 'Chili Con Carne',
  price: 7.5,
  isDrink: false
},{
  menuNumber: 12,
  description: 'Borsch With Smetana',
  price: 4.5,
  isDrink: false
}, {
  menuNumber: 13,
  description: 'Lamb Skewers with Tatziki',
  price: 8,
  isDrink: false
},{
  menuNumber: 14,
  description: 'Beef Stroganoff',
  price: 8.5,
  isDrink: false
}]

const el = createElement
render(
  el(BrowserRouter, null,
    el(ContainerView, {
      waitStaff, menu
    })
  ),
  document.getElementById('root')
)
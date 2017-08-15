import OpenTabView from './Components/OpenTab'

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
  price: 6
}]

const el = React.createElement
ReactDOM.render(
  el('div', {className:'container'},
    el('div', {className: 'row justify-content-md-center'},
      el(OpenTabView, {waitStaff: waitStaff.sort()})
    )
  ),
  document.getElementById('root')
)
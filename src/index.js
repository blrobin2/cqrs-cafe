import OpenTabView from './Components/OpenTab'

const waitStaff = [
  'Carl',
  'Meghan',
  'Dave',
  'Brittney'
]

const el = React.createElement
ReactDOM.render(
  el('div', {className:'container'},
    el('div', {className: 'row justify-content-md-center'},
      el(OpenTabView, {waitStaff: waitStaff.sort()})
    )
  ),
  document.getElementById('root')
)
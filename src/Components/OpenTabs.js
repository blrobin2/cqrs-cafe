import GUID from '../../lib/GUID'
import { openTabQueries } from '../Domain'

export default class OpenTabs extends React.Component {
  render() {
    const el = React.createElement
    return el('div', null,
      el('h2', null, 'Open Tabs'),
      el('ul', null,
        this.props.activeTableNumbers.map((t, i) => el('li', {key: i}, t))
      )
    )
  }
}
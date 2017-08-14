import TodoListGroup from './TodoListGroup'
import TodoListItem from './TodoListItem'

export default class ChefTodoList {
  constructor() {
    this.iSubscribeTo = ['FoodOrdered', 'FoodPrepared']
    this.todoList = []
  }

  getTodoList() {
    return this.todoList.map(grp => new TodoListGroup({
      tab: grp.tab,
      items: grp.items
    }))
  }

  handleFoodOrdered(event) {
    const group = new TodoListGroup({
      tab: event.id,
      items: event.orderedItems.map(i => new TodoListItem({
        menuNumber: i.menuNumber,
        description: i.description
      }))
    })

    this.todoList.push(group)
  }

  handleFoodPrepared(event) {
    const group = this.todoList.find(g => g.tab === event.id)
    event.menuNumbers.forEach(num => {
      const itemIndex = group.items.findIndex(i => i.menuNumber === num)
      if (itemIndex > -1) {
        group.items.splice(itemIndex, 1)
      }
    })

    if (group.items.length === 0) {
      const groupIndex = this.todoList.findIndex(g => g.tab === event.id);
      this.todoList.splice(groupIndex, 1)
    }
  }
}
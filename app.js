import { TodoList } from "./components/TodoList.js";
import { fetchJSON } from "./functions/api.js";
import { createElement } from "./functions/dom.js";

try {
  // const todos = await fetchJSON( 'https://jsonplaceholder.typicode.com/todos?_limit=5')
  // const todos = await fetchJSON( './data/todos.json')
  const todosInStorage = localStorage.getItem('todos')?.toString()
  let todos = []

  if (todosInStorage)
    todos = JSON.parse(todosInStorage)
  console.log(todos)

  const list = new TodoList(todos)
  list.appendTo(document.querySelector('#todolist'))

} catch (e) {
  console.log('e:', e.message)
  const alertElement = createElement('div', {
    class: 'alert alert-danger m-2',
    role: 'alert'
  })
  console.log("catch")
  alertElement.innerText = 'impossible de charger les éléments'
  document.body.prepend(alertElement)
  console.error(e)
}
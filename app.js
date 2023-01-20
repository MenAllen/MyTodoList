import { TodoList } from "./components/TodoList.js";
import { manageData } from "./components/DataSave.js";
import { fetchJSON } from "./functions/api.js";
import { createElement } from "./functions/dom.js";

try {

  //const todosInStorage = await fetchJSON( 'https://jsonplaceholder.typicode.com/todos?_limit=5')

  let todos =[]
  let todosInStorage = []

  todosInStorage = JSON.parse(localStorage.getItem('todos'))

  if (todosInStorage)
    todos = todosInStorage

  // initialize instance: list is copied to localStorage
  const list = new TodoList(todos)
  list.appendTo(document.querySelector('#todolist'))

  // setup listeners in Header menu
  document.querySelectorAll('.menu').forEach(button => button.addEventListener('click', e => manageData(e, todos)))

} catch (e) {
  const alertElement = createElement('div', {
    class: 'alert alert-danger m-2',
    role: 'alert'
  })
  alertElement.innerText = 'impossible de charger les éléments'
  document.body.prepend(alertElement)
  console.error(e)
}
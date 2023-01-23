import { createElement } from "../functions/dom.js";
//import "../style.css"

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} titile
 * @property {boolean} completed
 */

export class TodoList {

	/** @type {Todo[]} */
	#todos = [];

	/** @type {HTMLUListElement} */
	#listElement = [];

  /** @type {string} */
  #filterAction = '';

	/** @param {Todo[]} todos */
	constructor(todos) {
		this.#todos = todos;
    this.#filterAction = 'all'
    localStorage.setItem('todos', JSON.stringify(todos))
	}

	/** @param {HTMLElement} element */
	appendTo(element) {
		element.innerHTML = `<main>
    <ul class="list-group list-height">
    </ul>
    <form class="d-flex pb-4 pt-5">
      <input
      required=""
      class="form-control"
      type="text"
      placeholder="Ajouter une tâche..." 
      name="title"
      data-com.bitwarden.browser.user-edited="yes"
      />
      <button class="btn btn-primary bg-color-custom-dark bg-border-color-dark" aria-label="add a todo">Ajouter</button>
    </form>
    <div class="btn-group mb-4" role="group">
      <div class="title-selection">Sélection</div>
      <button type="button" class="btn btn-outline-custom active-custom" data-filter="all" aria-label="filtre toutes tâches">
        Toutes tâches
      </button>
      <button type="button" class="btn btn-outline-custom" data-filter="todo" aria-label="filtre tâches à faire">Tâches à faire</button>
      <button type="button" class="btn btn-outline-custom" data-filter="done" aria-label="filtre tâches faites">Tâches faites</button>
    </div>
  </main>`;

		this.#listElement = element.querySelector(".list-group");
		for (let todo of this.#todos) {
			const task = new TodoListItem(todo);
			this.#listElement.append(task.element);
		}
    element.querySelector('form').addEventListener('submit', e => this.#onSubmit(e))

    element.querySelectorAll('.btn-group button').forEach(button => { button.addEventListener('click', (e) => this.#toggleFilter(e) )})

    this.#listElement.addEventListener('delete', ({detail: todo}) => {
      this.#todos = this.#todos.filter( t => t !== todo)
      this.onUpdate()
    })

    this.#listElement.addEventListener('toggle', ({detail: todo} ) => {
      todo.completed = !todo.completed
      this.onUpdate()
    })

	}

  /**
   * 
   * @param {SubmitEvent} e 
   */
  #onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget
    const title = new FormData(form).get('title').toString().trim();
    if (title === '') {
      return
    }
    const todo = {
      title,
      id: Date.now(),
      checked: false
    }
      
    const newtask = new TodoListItem(todo)
    this.#listElement.prepend(newtask.element)
    this.#todos.unshift(todo);
    this.onUpdate()
    form.reset()
  }

  /**
   * Update Filter action
   * 
   * @param {PointerEvent} e 
   */
  #toggleFilter(e) {
    e.preventDefault()
    this.#filterAction = e.currentTarget.getAttribute('data-filter')
    e.currentTarget.parentElement.querySelector('.active-custom').classList.remove('active-custom')
    e.currentTarget.classList.add('active-custom')

    if (this.#filterAction === 'todo') {
      this.#listElement.classList.add('hide-completed')
      this.#listElement.classList.remove('hide-todo')
    } else if (this.#filterAction === 'done') {
      this.#listElement.classList.add('hide-todo')
      this.#listElement.classList.remove('hide-completed')
    } else {
      this.#listElement.classList.remove('hide-todo')
      this.#listElement.classList.remove('hide-completed')
    }
    this.onUpdate()
  }

  onUpdate () {
    localStorage.setItem('todos', JSON.stringify(this.#todos))
  }
}

export class TodoListItem {
	#element;
  #todo;

	/** @param {Todo} todo */
	constructor(todo) {
    this.#todo = todo;
		const id = `todo-${todo.id}`;
		const li = createElement("li", {
			class: "todo list-group-item d-flex align-items-center",
		});
    this.#element = li;

		const checkbox = createElement("input", {
			class: "form-check-input",
			type: "checkbox",
			id,
      checked: todo.completed ? '' : null
		});

		const label = createElement("label", {
			class: "ms-2 form-check-label",
			for: id,
		});
		label.innerText = todo.title;

		const button = createElement("button", {
			class: "ms-auto btn btn-danger btn-sm bg-color-custom-dark bg-border-color-dark",
      title: "trash"
		});
		button.innerHTML = '<i class="bi-trash"> </i>';

		li.append(checkbox);
		li.append(label);
		li.append(button);
    this.toggle(checkbox)

    button.addEventListener('click', e => this.remove(e))
    checkbox.addEventListener('click', e => this.toggle(e.currentTarget))

	}

  /**
   * @return {HTMLElement}
   */
  get element () {
    return this.#element
  }

  /** @param {PointerEvent} e */
  remove(e) {
    e.preventDefault()
    const event = new CustomEvent('delete', {
      detail: this.#todo,
      bubbles: true
    })
    this.#element.dispatchEvent(event)
    this.#element.remove()

  }

  /**
   * Change l'état ( fait / à faire ) de la tâche
   * @param {*} checkbox 
   */
  toggle(checkbox) {
    if (checkbox.checked) {
      this.#element.classList.add('is-completed')
    } else {
      this.#element.classList.remove('is-completed')
    }
    const event = new CustomEvent('toggle', {
      detail: this.#todo,
      bubbles: true
    })
    this.#element.dispatchEvent(event)
  }
}

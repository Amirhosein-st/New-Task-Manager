let todos = [];

function addTodo() {
  const todoText = todoInput.value.trim();
  const todoCategory = categoryInput.value.trim();

  if (todoText === '') {
    alert('Please enter a task!');
    return;
  }

  if (todos.some(todo => todo.text === todoText)) {
    alert('Task already exists!');
    return;
  }

  const todo = {
    text: todoText,
    category: todoCategory,
    added: new Date().toLocaleString('en-US', { hour12: false }),
    completed: false,
    bookmarked: false
  };

  todos.push(todo);
  saveTodos();
  renderTodos();

  todoInput.value = '';
  categoryInput.value = '';
}

function editTodo() {
  const todoItem = this.parentElement.parentElement;
  const index = todoItem.dataset.index;
  const todoText = todoItem.querySelector('.todo-text').innerText;
  const todo = todos[index];
  const newTodoText = prompt('Enter new todo text:', todoText);
  if (newTodoText !== null && newTodoText !== '') {
    todo.text = newTodoText;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo() {
  const todoItem = this.parentElement.parentElement;
  const index = todoItem.dataset.index;
  const todo = todos[index];
  if (confirm(`Are you sure you want to delete ${todo.text} task?`)) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }
}

function completeTodo() {
  const todoItem = this.parentElement.parentElement;
  const index = todoItem.dataset.index;
  const todo = todos[index];
  const completedDate = new Date().toLocaleString('en-US', { hour12: false });

  if (confirm(`Are you sure you want to mark "${todo.text}" as ${this.checked ? 'completed' : 'incomplete'}?`)) {
    todo.completed = this.checked;
    todo.completedDate = completedDate;
    saveTodos();
    renderTodos();
  } else {
    this.checked = !this.checked;
  }
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todosJSON = localStorage.getItem('todos');
  if (todosJSON !== null) {
    todos = JSON.parse(todosJSON);
    renderTodos();
  }
}

function renderTodos() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  let rowNumber = 1;
  todos.forEach((todo, index) => {
    const todoRow = document.createElement('tr');
    todoRow.dataset.index = index;
    todoRow.draggable = true;

    todoRow.innerHTML = `
          <td class="Row-Number" title="The Row Number = ${rowNumber}">${rowNumber}</td>
          <td class="complete-task"><input type="checkbox" ${todo.completed ? 'checked' : ''} title="Task Status"></td>
          <td class="todo-category ${todo.completed ? 'completed' : ''}" title="Category= ${todo.category}">
          <p class="mobile-category">Category:</p>  ${todo.category}
          </td>
          <td class="edit-1">
          <i class="fa-solid fa-edit edit-category" title="Edit Task Category ${rowNumber}"></i>
          </td>
          <td class="todo-text ${todo.completed ? 'completed' : ''}" title="Task= ${todo.text}">
          <p class="mobile-task">Task:</p> ${todo.text}
          </td>
          <td class="edit-2">
          <i class="fa-sharp fa-solid fa-file-pen edit-todo" title="Edit Task Text ${rowNumber}"></i>
          </td>
          <td class="todo-added ${todo.completed ? 'completed' : ''}"  title="This Task Added On= ${todo.added}">
          <p class="mobile-added" style="white-space: nowrap;">Added On:</p> ${todo.added}</td>
          <td class="todo-completed-date" title="This Task completed On= ${todo.completed ? todo.completedDate : ''}">
          <p class="mobile-Completed" style="white-space: nowrap;">Completed On:</p> ${todo.completed ? todo.completedDate : ''}</td>
           <td class="todo-actions-2">
           <i class="fas fa-bookmark bookmark-todo ${todo.bookmarked ? 'bookmarked' : ''}" title="Bookmark Your Task"></i>
           </td>
           <td class="todo-delete">
           <i class="fa-solid fa-file-excel delete-todo" title="Delete Your Task"></i>
           </td>
        `;

    rowNumber++;

    const editButton = todoRow.querySelector('.edit-todo');
    if (!todo.completed) {
      editButton.addEventListener('click', editTodo);
    } else {
      editButton.style.display = 'none';
    }

    const deleteButton = todoRow.querySelector('.delete-todo');
    const completeCheckbox = todoRow.querySelector('input[type="checkbox"]');
    const bookmarkIcon = todoRow.querySelector('.bookmark-todo');

    editButton.addEventListener('click', editTodo);
    deleteButton.addEventListener('click', deleteTodo);
    completeCheckbox.addEventListener('change', completeTodo);
    bookmarkIcon.addEventListener('click', bookmarkTodo);
    todoRow.addEventListener('dragstart', handleDragStart);
    todoRow.addEventListener('dragover', handleDragOver);
    todoRow.addEventListener('drop', handleDrop);

    const editCategoryButton = todoRow.querySelector('.edit-category');
    if (todo.completed) {
      editCategoryButton.style.display = 'none';
    } else {
      editCategoryButton.addEventListener('click', editCategory);
    }

    editButton.addEventListener('click', editTodo);
    deleteButton.addEventListener('click', deleteTodo);
    completeCheckbox.addEventListener('change', completeTodo);
    bookmarkIcon.addEventListener('click', bookmarkTodo);
    editCategoryButton.addEventListener('click', editCategory);

    todoList.appendChild(todoRow);
  });
}

function editCategory() {
  const todoItem = this.parentElement.parentElement;
  const index = todoItem.dataset.index;
  const todoCategory = todos[index].category;
  const newTodoCategory = prompt('Enter new category:', todoCategory);
  if (newTodoCategory !== null && newTodoCategory !== '') {
    todos[index].category = newTodoCategory;
    saveTodos();
    renderTodos();
  }
}

var todoInput = document.getElementById('todo-input');
var categoryInput = document.getElementById('category-input');
var addTodoButton = document.getElementById('add-todo');
addTodoButton.addEventListener('click', addTodo);

function clearTodos() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    todos = [];
    saveTodos();
    renderTodos();
  }
}

var clearTodosButton = document.getElementById('clear-todos');
clearTodosButton.addEventListener('click', clearTodos);

function bookmarkTodo() {
  const todoItem = this.parentElement.parentElement;
  const index = todoItem.dataset.index;
  const todo = todos[index];

  if (todo.bookmarked) {
    todos[index].bookmarked = false;
    this.classList.remove('bookmarked');
  } else {
    todos[index].bookmarked = true;
    this.classList.add('bookmarked');
  }

  saveTodos();
}

function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
    const srcIndex = parseInt(dragSrcEl.dataset.index);
    const destIndex = parseInt(this.dataset.index);
    const srcTodo = todos[srcIndex];
    todos.splice(srcIndex, 1);
    todos.splice(destIndex, 0, srcTodo);
    saveTodos();
    renderTodos();
  }
  return false;
}

var dragSrcEl = null;

loadTodos();

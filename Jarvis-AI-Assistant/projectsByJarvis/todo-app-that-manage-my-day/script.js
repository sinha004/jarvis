// script.js

/**
 * Todo App - Manage My Day
 *
 * Features:
 * - Add new todos
 * - Mark todos as complete
 * - Delete todos
 * - Filter todos (All, Active, Completed)
 * - Responsive design
 * - Modern UI with animations
 *
 * Author: Bard
 */

document.addEventListener('DOMContentLoaded', async () => {
  const todoInput = document.getElementById('todoInput');
  const addTodoButton = document.getElementById('addTodoButton');
  const todoList = document.getElementById('todoList');
  const filterButtons = document.querySelectorAll('.filter-button');
  const clearCompletedButton = document.getElementById('clearCompleted');
  const todoCount = document.getElementById('todoCount');

  let todos = [];
  let currentFilter = 'all';

  /**
   * Load todos from local storage
   */
  async function loadTodos() {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        todos = JSON.parse(storedTodos);
      }
    } catch (error) {
      console.error('Error loading todos from local storage:', error);
      // Optionally display an error message to the user
    }
  }

  /**
   * Save todos to local storage
   */
  async function saveTodos() {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to local storage:', error);
      // Optionally display an error message to the user
    }
  }

  /**
   * Create a todo item element
   * @param {object} todo - The todo object
   * @returns {HTMLLIElement} - The todo list item element
   */
  function createTodoItem(todo) {
    const listItem = document.createElement('li');
    listItem.classList.add('todo-item');
    listItem.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.classList.add('todo-checkbox');
    checkbox.addEventListener('change', () => toggleComplete(todo.id));

    const label = document.createElement('label');
    label.textContent = todo.text;
    label.classList.add('todo-label');
    if (todo.completed) {
      label.classList.add('completed');
    }

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;';
    deleteButton.classList.add('todo-delete');
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(deleteButton);

    // Add animation
    setTimeout(() => {
      listItem.classList.add('show');
    }, 10);

    return listItem;
  }

  /**
   * Render the todo list based on the current filter
   */
  function renderTodoList() {
    todoList.innerHTML = '';
    const filteredTodos = getFilteredTodos();

    filteredTodos.forEach(todo => {
      const listItem = createTodoItem(todo);
      todoList.appendChild(listItem);
    });

    updateTodoCount();
  }

  /**
   * Get the filtered todos based on the current filter
   * @returns {array} - The filtered todos
   */
  function getFilteredTodos() {
    switch (currentFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }

  /**
   * Add a new todo
   */
  async function addTodo() {
    const text = todoInput.value.trim();

    if (!text) {
      alert('Please enter a todo!');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
    };

    todos.push(newTodo);
    await saveTodos();
    renderTodoList();
    todoInput.value = '';
  }

  /**
   * Toggle the complete status of a todo
   * @param {number} id - The ID of the todo to toggle
   */
  async function toggleComplete(id) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    await saveTodos();
    renderTodoList();
  }

  /**
   * Delete a todo
   * @param {number} id - The ID of the todo to delete
   */
  async function deleteTodo(id) {
    const listItem = document.querySelector(`[data-id="${id}"]`);
    listItem.classList.remove('show'); // Start fade-out animation
    setTimeout(async () => {
      todos = todos.filter(todo => todo.id !== id);
      await saveTodos();
      renderTodoList();
    }, 200); // Wait for animation to complete before removing from DOM
  }

  /**
   * Set the current filter
   * @param {string} filter - The filter to set
   */
  function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(button => button.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    renderTodoList();
  }

  /**
   * Clear all completed todos
   */
  async function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    await saveTodos();
    renderTodoList();
  }

  /**
   * Update the todo count
   */
  function updateTodoCount() {
    const activeTodoCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${activeTodoCount} item${activeTodoCount !== 1 ? 's' : ''} left`;
  }

  // Event listeners
  addTodoButton.addEventListener('click', addTodo);
  todoInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      setFilter(button.dataset.filter);
    });
  });

  clearCompletedButton.addEventListener('click', clearCompleted);

  // Initialize
  await loadTodos();
  renderTodoList();
});
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    
    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // Initialize the app
    renderTodos();
    
    // Event listeners
    taskInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        addTodo();
      }
    });
    
    addButton.addEventListener('click', addTodo);
    
    // Functions
    function addTodo() {
      const text = taskInput.value.trim();
      
      if (text) {
        const todo = {
          id: Date.now().toString(),
          text: text,
          completed: false,
          createdAt: Date.now()
        };
        
        todos.push(todo);
        saveTodos();
        renderTodos();
        taskInput.value = '';
      }
    }
    
    function toggleTodo(id) {
      todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos();
      renderTodos();
    }
    
    function deleteTodo(id) {
      const todoElement = document.getElementById(`todo-${id}`);
      todoElement.classList.add('deleting');
      
      setTimeout(() => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
      }, 300);
    }
    
    function renderTodos() {
      // Show/hide empty state
      if (todos.length === 0) {
        emptyState.style.display = 'flex';
        todoList.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        todoList.style.display = 'block';
        
        // Clear current list
        todoList.innerHTML = '';
        
        // Add todo items
        todos.forEach(todo => {
          const li = document.createElement('li');
          li.id = `todo-${todo.id}`;
          li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
          
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = todo.completed;
          checkbox.addEventListener('change', () => toggleTodo(todo.id));
          
          const span = document.createElement('span');
          span.className = 'todo-item-text';
          span.textContent = todo.text;
          
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>';
          deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
          
          li.appendChild(checkbox);
          li.appendChild(span);
          li.appendChild(deleteBtn);
          todoList.appendChild(li);
        });
      }
    }
    
    function saveTodos() {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  });
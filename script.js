document.addEventListener("DOMContentLoaded", function () {

    const modeToggle = document.getElementById("modeToggle");
    const todoInput = document.getElementById("todoInput");
    const addButton = document.getElementById("addButton");
    const todoList = document.getElementById("toDoList");
    const searchInput = document.getElementById("searchInput");
    const emptyState = document.getElementById("emptyState");

    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let editingId = null;

    modeToggle.addEventListener("click",toggleLightMode);

    addButton.addEventListener("click", addTodo);
    todoInput.addEventListener('keypress', e => {
        if (e.key === "Enter") addTodo()
    });
    searchInput.addEventListener("input",filterTodos);
    
    renderTodos();
    loadLightModePreference();

    function toggleLightMode() {
        const isLightMode = document.body.classList.toggle("light-mode");
        localStorage.setItem("lightMode",isLightMode);
        modeToggle.textContent= isLightMode? "🌙":"🌞";
    }

    function loadLightModePreference() {
        const isLightMode = localStorage.getItem("lightMode") === true;
        if( isLightMode) {
            document.body.classList.add("light-mode")
            modeToggle.text ="🌙"
        }
    }

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText === "") return;

        if (editingId !== null) {
            const index = todos.findIndex(todo => todo.id === editingId);
            if (index !== -1) {
                todos[index].text = todoText;
                editingId = null;
                addButton.textContent = "Add";
            }
        } else {
            const newTodo = {
                id: Date.now(),
                text: todoText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            todos.push(newTodo);
        }
        saveTodos();
        renderTodos();
        todoInput.value = "";
        todoInput.focus();
    }
    function filterTodos() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTodos = todos.filter(todo =>
            todo.text.toLowerCase().includes(searchTerm)
        );
        renderTodoList(filteredTodos);
    }

    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos))
    }

    function renderTodos() {
        if(searchInput.value.trim() !== "") {
            filterTodos()
        } else {
            renderTodoList(todos);
        }
        renderTodoList(todos);
    }

    function toggleComplete(id) {
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }
    }

    function editTodo(id) {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            todoInput.value = todo.text;
            todoInput.focus();
            editingId = id;
            addButton.textContent = "Update";
        }
    }
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);

        if(editingId === id){
            editingId = null;
            todoInput.value = "";
            addButton.textContent="Add";
        }
        saveTodos();
        renderTodos();

    }

    function renderTodoList(todosToRender) {
        todoList.innerHTML = '';

        if (todosToRender.length === 0) {
            emptyState.style.display = "block";
        }
        else {
            emptyState.style.display = "none";

            todosToRender.forEach(todo => {
                const todoItem = document.createElement("li");
                todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

                todoItem.innerHTML = `
                <input type="checkbox" class="checkbox" ${todo.completed ? "checked" : ""}>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <div class="actions">
                    <button class="btn edit-btn">🖊</button>
                    <button class="btn delete-btn">❌</button>
                </div>
                `;

                const checkbox = todoItem.querySelector(".checkbox");
                const editBtn = todoItem.querySelector(".edit-btn");
                const deleteBtn = todoItem.querySelector(".delete-btn");

                checkbox.addEventListener("change",()=>toggleComplete(todo.id));
                editBtn.addEventListener("click",()=>editTodo(todo.id));
                deleteBtn.addEventListener("click",()=>deleteTodo(todo.id));

                todoList.appendChild(todoItem);
            });
        }
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
});

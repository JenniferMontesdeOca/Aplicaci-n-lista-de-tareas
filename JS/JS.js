// Estructura de un nodo de lista enlazada para almacenar los datos y avanzar al siguiente nodo
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

// Lista enlazada que enfoca al primer elemento de la lista
class LinkedList {
    constructor() {
        this.head = null;
    }

    // Agrega un nodo al final de la lista
    add(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    // Marca una tarea como completada
    toggleCompleted(index) {
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        current.data.completed = !current.data.completed;
    }

    // Elimina una tarea de la lista
    remove(index) {
        if (index === 0) {
            this.head = this.head.next;
        } else {
            let current = this.head;
            let prev = null;
            for (let i = 0; i < index; i++) {
                prev = current;
                current = current.next;
            }
            prev.next = current.next;
        }
    }
}

// Inicializa una nueva lista enlazada para almacenar las tareas
const taskList = new LinkedList();

// Función para mostrar las tareas en la interfaz de usuario
function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';
    let current = taskList.head;
    let index = 0;
    while (current) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <input type="checkbox" id="task${index}" ${current.data.completed ? 'checked' : ''}>
            <label for="task${index}" class="${current.data.completed ? 'completed' : ''}">${current.data.text}</label>
            <button class="deleteBtn" data-index="${index}">Eliminar</button>
        `;
        taskListElement.appendChild(taskItem);
        current = current.next;
        index++;
    }
}

// Función para agregar una nueva tarea a la lista
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        taskList.add({ text: taskText, completed: false });
        renderTasks();
        taskInput.value = '';
        updateLocalStorage();
    }
}

// Función para manejar el cambio en el estado de completado de una tarea
function toggleCompleted(index) {
    taskList.toggleCompleted(index);
    renderTasks();
    updateLocalStorage();
}

// Función para eliminar una tarea de la lista
function deleteTask(index) {
    taskList.remove(index);
    renderTasks();
    updateLocalStorage();
}

// Función para cargar las tareas almacenadas en el almacenamiento local
function loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => taskList.add(task));
        renderTasks();
    }
}

// Función para actualizar las tareas en el almacenamiento local
function updateLocalStorage() {
    const tasks = [];
    let current = taskList.head;
    while (current) {
        tasks.push(current.data);
        current = current.next;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskList').addEventListener('change', function(e) {
    if (e.target.matches('input[type="checkbox"]')) {
        const index = parseInt(e.target.id.replace('task', ''));
        toggleCompleted(index);
    }
});
document.getElementById('taskList').addEventListener('click', function(e) {
    if (e.target.matches('.deleteBtn')) {
        const index = parseInt(e.target.dataset.index);
        deleteTask(index);
    }
});

// Cargar tareas desde el almacenamiento local al cargar la página
loadFromLocalStorage();

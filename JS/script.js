// Select necessary DOM elements
const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Add event listener for 'Add' button
addTaskBtn.addEventListener('click', addTask);

// Store the currently dragged element
let draggedTask = null;

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const li = createTaskElement(taskText);

    // Append the new task to the list
    taskList.appendChild(li);

    // Clear the input field
    taskInput.value = '';
}

// Function to create a task element
function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.setAttribute('draggable', true);

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.classList.add('task-date');

    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="check-btn">✔️</button>
        <button class="delete-btn">Delete</button>
        <button class="drag-btn">Drag</button>
        <button class="add-subtask-btn">Add Subtask</button>
    `;


    
    // Insert the date input before the buttons
    li.insertBefore(dateInput, li.querySelector('.check-btn'));

    // Create a container for subtasks
    const subtaskList = document.createElement('ul');
    subtaskList.classList.add('subtask-list');
    li.appendChild(subtaskList);

    // Add event listener to check off task as completed
    li.querySelector('.check-btn').addEventListener('click', function () {
        li.classList.toggle('completed');
    });


    // Add event listener to delete task
    li.querySelector('.delete-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        taskList.removeChild(li);
    });

    // Add event listener to add a subtask
    li.querySelector('.add-subtask-btn').addEventListener('click', function () {
        addSubtask(subtaskList);
    });

    // Add event listener to trigger drag functionality
    li.querySelector('.drag-btn').addEventListener('mousedown', function (e) {
        // Simulate starting the drag
        li.draggable = true; // Ensure the item is draggable
        draggedTask = li;
        li.dispatchEvent(new Event('dragstart')); // Simulate drag start
    });

    // Add double-click event for task editing
    li.querySelector('.task-text').addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editTask(li);
    });

    // Add drag-and-drop event listeners
    li.addEventListener('dragstart', function () {
        draggedTask = li;
        setTimeout(() => li.classList.add('dragging'), 0);
    });

    li.addEventListener('dragend', function () {
        setTimeout(() => {
            draggedTask = null;
            li.classList.remove('dragging');
        }, 0);
    });

    li.addEventListener('dragover', function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggedTask);
        } else {
            taskList.insertBefore(draggedTask, afterElement);
        }
    });

    return li;
}

// Function to add a subtask
function addSubtask(subtaskList) {
    const subtaskText = prompt('Enter subtask:');
    if (subtaskText && subtaskText.trim() !== '') {
        const subtaskLi = createSubtaskElement(subtaskText);
        subtaskList.appendChild(subtaskLi);
    }
}

// Function to create a subtask element
function createSubtaskElement(subtaskText) {
    const subtaskLi = document.createElement('li');
    subtaskLi.innerHTML = `
        <span class="subtask-text">${subtaskText}</span>
        <button class="check-subtask-btn">✔️</button>
        <button class="delete-subtask-btn">Delete</button>
    `;

    // Add event listener to check off subtask as completed
    subtaskLi.querySelector('.check-subtask-btn').addEventListener('click', function () {
        subtaskLi.classList.toggle('completed');
    });

    // Add event listener to delete subtask
    subtaskLi.querySelector('.delete-subtask-btn').addEventListener('click', function () {
        subtaskLi.parentNode.removeChild(subtaskLi);
    });

    return subtaskLi;
}

// Function to handle editing a task
function editTask(taskItem) {
    const taskTextElement = taskItem.querySelector('.task-text');
    const currentText = taskTextElement.textContent;
    
    // Create an input element to replace the task text
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.classList.add('edit-input');

    // Replace the span with the input field
    taskItem.replaceChild(input, taskTextElement);
    input.focus();

    // Handle saving the edit with 'Enter' and canceling with 'Esc'
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            saveEdit(taskItem, input.value);
        } else if (e.key === 'Escape') {
            cancelEdit(taskItem, currentText);
        }
    });

    // Handle clicking outside the input to save the edit
    input.addEventListener('blur', function () {
        saveEdit(taskItem, input.value);
    });
}

// Function to save the edited task
function saveEdit(taskItem, newText) {
    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = newText;

    // Restore the original structure
    taskItem.replaceChild(taskTextElement, taskItem.querySelector('.edit-input'));

    // Re-add the double-click event listener for editing
    taskTextElement.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editTask(taskItem);
    });
}

// Function to cancel editing and revert to the original text
function cancelEdit(taskItem, originalText) {
    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = originalText;

    // Restore the original structure
    taskItem.replaceChild(taskTextElement, taskItem.querySelector('.edit-input'));

    // Re-add the double-click event listener for editing
    taskTextElement.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editTask(taskItem);
    });
}

// Function to get the closest element after the current drag position
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
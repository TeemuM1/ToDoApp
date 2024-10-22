const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');


addTaskBtn.addEventListener('click', addTask);


let draggedTask = null;


function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const li = createTaskElement(taskText);

    
    taskList.appendChild(li);

    
    taskInput.value = '';
}


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


    
    
    li.insertBefore(dateInput, li.querySelector('.check-btn'));

    
    const subtaskList = document.createElement('ul');
    subtaskList.classList.add('subtask-list');
    li.appendChild(subtaskList);

    
    li.querySelector('.check-btn').addEventListener('click', function () {
        li.classList.toggle('completed');
    });


   
    li.querySelector('.delete-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        taskList.removeChild(li);
    });

    
    li.querySelector('.add-subtask-btn').addEventListener('click', function () {
        addSubtask(subtaskList);
    });

    
    li.querySelector('.drag-btn').addEventListener('mousedown', function (e) {
        
        li.draggable = true; 
        draggedTask = li;
        li.dispatchEvent(new Event('dragstart')); 
    });
    
    li.querySelector('.task-text').addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editTask(li);
    });

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

function addSubtask(subtaskList) {
    const subtaskText = prompt('Enter subtask:');
    if (subtaskText && subtaskText.trim() !== '') {
        const subtaskLi = createSubtaskElement(subtaskText);
        subtaskList.appendChild(subtaskLi);
    }
}

function createSubtaskElement(subtaskText) {
    const subtaskLi = document.createElement('li');
    subtaskLi.innerHTML = `
        <span class="subtask-text">${subtaskText}</span>
        <button class="check-subtask-btn">✔️</button>
        <button class="delete-subtask-btn">Delete</button>
    `;

    
    subtaskLi.querySelector('.subtask-text').addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editSubtask(subtaskLi);
    });

    subtaskLi.querySelector('.check-subtask-btn').addEventListener('click', function () {
        subtaskLi.classList.toggle('completed');
    });

    subtaskLi.querySelector('.delete-subtask-btn').addEventListener('click', function () {
        subtaskLi.parentNode.removeChild(subtaskLi);
    });

    return subtaskLi;
}

function editTask(taskItem) {
    const taskTextElement = taskItem.querySelector('.task-text');
    const currentText = taskTextElement.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.classList.add('edit-input');

    
    taskItem.replaceChild(input, taskTextElement);
    input.focus();

    
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            saveEdit(taskItem, input.value);
        } else if (e.key === 'Escape') {
            cancelEdit(taskItem, currentText);
        }
    });

    
    input.addEventListener('blur', function () {
        saveEdit(taskItem, input.value);
    });
}


function saveEdit(taskItem, newText) {
    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = newText;

    
    taskItem.replaceChild(taskTextElement, taskItem.querySelector('.edit-input'));

    
    taskTextElement.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editTask(taskItem);
    });
}


function cancelEdit(taskItem, originalText) {
    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = originalText;

    
    taskItem.replaceChild(taskTextElement, taskItem.querySelector('.edit-input'));

    
    taskTextElement.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editTask(taskItem);
    });
}


function editSubtask(subtaskItem) {
    const subtaskTextElement = subtaskItem.querySelector('.subtask-text');
    const currentText = subtaskTextElement.textContent;

    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.classList.add('edit-input');

    
    subtaskItem.replaceChild(input, subtaskTextElement);
    input.focus();

    
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            saveSubtaskEdit(subtaskItem, input.value);
        } else if (e.key === 'Escape') {
            cancelSubtaskEdit(subtaskItem, currentText);
        }
    });

    
    input.addEventListener('blur', function () {
        saveSubtaskEdit(subtaskItem, input.value);
    });
}


function saveSubtaskEdit(subtaskItem, newText) {
    const subtaskTextElement = document.createElement('span');
    subtaskTextElement.classList.add('subtask-text');
    subtaskTextElement.textContent = newText;

    
    subtaskItem.replaceChild(subtaskTextElement, subtaskItem.querySelector('.edit-input'));

    
    subtaskTextElement.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editSubtask(subtaskItem);
    });
}


function cancelSubtaskEdit(subtaskItem, originalText) {
    const subtaskTextElement = document.createElement('span');
    subtaskTextElement.classList.add('subtask-text');
    subtaskTextElement.textContent = originalText;

    
    subtaskItem.replaceChild(subtaskTextElement, subtaskItem.querySelector('.edit-input'));

    
    subtaskTextElement.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        editSubtask(subtaskItem);
    });
}


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
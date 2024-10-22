// Function to add a new task to the list
function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const taskList = document.getElementById('task-list');

        // Create new list item (li) element
        const li = document.createElement('li');

        // Add text to the li element
        li.appendChild(document.createTextNode(taskText));

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.appendChild(document.createTextNode('Remove'));
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = removeTask;

        // Append remove button to the list item
        li.appendChild(removeBtn);

        // Add click event to mark the task as completed
        li.onclick = toggleCompleteTask;

        // Append the list item to the task list
        taskList.appendChild(li);

        // Clear the input field
        taskInput.value = "";
    }
}

// Function to toggle task completion (mark as complete/incomplete)
function toggleCompleteTask(event) {
    if (event.target.tagName !== 'BUTTON') {  // Prevents clicking on Remove button from toggling
        event.target.classList.toggle('completed');
    }
}

// Function to remove a task from the list
function removeTask(event) {
    const li = event.target.parentElement;
    li.remove();
}

// Add event listener to the "Add" button
document.getElementById('add-task-btn').addEventListener('click', addTask);

// Allow pressing Enter to add a task
document.getElementById('task-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

document.getElementById('addTaskBtn').addEventListener('click', function () {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const task = document.createElement('div');
        task.classList.add('task');
        task.setAttribute('draggable', 'true');
        task.textContent = taskText;

        task.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text', taskText);
            task.classList.add('dragging');
        });

        task.addEventListener('dragend', function () {
            task.classList.remove('dragging');
        });

        // Adding the task to "To Do" column by default
        document.getElementById('toDoList').appendChild(task);
        taskInput.value = ""; // Clear input after adding
    }
});

// Enable drag-and-drop functionality for task movement
const columns = document.querySelectorAll('.board-column');
columns.forEach(column => {
    column.addEventListener('dragover', function (e) {
        e.preventDefault();
        const draggingTask = document.querySelector('.task.dragging');
        const closestTask = getClosestTask(e.clientY, column);
        if (closestTask) {
            column.insertBefore(draggingTask, closestTask);
        } else {
            column.appendChild(draggingTask);
        }
    });

    column.addEventListener('drop', function (e) {
        e.preventDefault();
        const taskText = e.dataTransfer.getData('text');
        const newTask = document.createElement('div');
        newTask.classList.add('task');
        newTask.textContent = taskText;

        // Move task to the appropriate column
        column.querySelector(`#${getColumnId(column)}List`).appendChild(newTask);
    });
});

// Helper function to get closest task based on mouse position
function getClosestTask(y, column) {
    const tasks = [...column.querySelectorAll('.task')];
    return tasks.reduce((closest, task) => {
        const box = task.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: task };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Helper function to get column ID
function getColumnId(column) {
    if (column.id === 'toDoColumn') return 'toDo';
    if (column.id === 'inProgressColumn') return 'inProgress';
    if (column.id === 'completedColumn') return 'completed';
}
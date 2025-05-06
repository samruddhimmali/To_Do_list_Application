let tasks = [];
let currentFilter = 'all'; // all | pending | completed

// Load tasks from localStorage on page load
window.onload = () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
  rebuildTable();
};

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const dueDateInput = document.getElementById('dueDateInput');
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!taskText) {
    alert("Please enter a task.");
    return;
  }

  const taskObj = {
    text: taskText,
    due: dueDate || '',
    completed: false
  };

  tasks.push(taskObj);
  saveTasks();
  rebuildTable();

  taskInput.value = '';
  dueDateInput.value = '';
}

function rebuildTable() {
  const tbody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  tasks.forEach((task, index) => {
    if (
      currentFilter === 'all' ||
      (currentFilter === 'pending' && !task.completed) ||
      (currentFilter === 'completed' && task.completed)
    ) {
      addTaskToTable(task, index);
    }
  });
}

function addTaskToTable(taskObj, index) {
  const table = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
  const row = table.insertRow();

  const taskCell = row.insertCell(0);
  const dueDateCell = row.insertCell(1);
  const statusCell = row.insertCell(2);
  const actionsCell = row.insertCell(3);

  taskCell.textContent = taskObj.text;
  dueDateCell.textContent = taskObj.due || '—';
  statusCell.textContent = taskObj.completed ? "Done" : "Pending";

  if (taskObj.completed) {
    row.classList.add('completed');
  }

  const completeBtn = document.createElement('button');
  completeBtn.innerHTML = '<i class="fas fa-check"></i>';
  completeBtn.title = "Mark Done";
  completeBtn.classList.add('icon-btn', 'done-btn');
  completeBtn.onclick = () => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    rebuildTable();
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.title = "Delete";
  deleteBtn.classList.add('icon-btn', 'delete-btn');
  deleteBtn.onclick = () => {
    tasks.splice(index, 1);
    saveTasks();
    rebuildTable();
  };

  actionsCell.appendChild(completeBtn);
  actionsCell.appendChild(deleteBtn);
}

function setFilter(filter) {
  currentFilter = filter;
  rebuildTable();

  // Highlight active filter button
  document.querySelectorAll('div > button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`div > button[onclick="setFilter('${filter}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

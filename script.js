/* --- JavaScript Logic --- */

// Select elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const emptyState = document.getElementById("emptyState");
const clearAllBtn = document.getElementById("clearAllBtn");
const filterBtns = document.querySelectorAll(".filter-btn");
const dateDisplay = document.getElementById("dateDisplay");

let tasks = [];
let currentFilter = "all";

// Set today's date
const today = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
dateDisplay.textContent = today.toLocaleDateString("en-US", options);

// Load tasks on startup
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task when button is clicked
addBtn.addEventListener("click", addTask);

// Add task when "Enter" key is pressed
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Clear completed tasks
clearAllBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

// Filter buttons
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    // Shake animation for empty input
    taskInput.style.animation = "shake 0.3s";
    setTimeout(() => (taskInput.style.animation = ""), 300);
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  tasks.push(task);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

// Function to toggle task status
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Function to delete a task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// Render tasks based on filter
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  // Show/hide empty state
  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";
    emptyState.querySelector("p").textContent =
      currentFilter === "all"
        ? "No tasks yet!"
        : currentFilter === "pending"
          ? "All done! 🎉"
          : "No completed tasks";
  } else {
    emptyState.style.display = "none";
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
                    <div class="task-left">
                        <div class="checkbox" onclick="toggleTask(${task.id})"></div>
                        <span class="task-text" onclick="toggleTask(${task.id})">${escapeHtml(task.text)}</span>
                    </div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">&times;</button>
                `;

    taskList.appendChild(li);
  });

  updateStats();
}

// Update statistics
function updateStats() {
  const remaining = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;

  if (remaining === 0 && total > 0) {
    pendingCount.textContent = "All done! 🎉";
  } else {
    pendingCount.textContent = `${remaining} item${remaining !== 1 ? "s" : ""} left`;
  }
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const savedTasks = localStorage.getItem("myTasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

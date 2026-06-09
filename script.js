const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Enter key support
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Add Task
function addTask() {
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  createTask(taskText);

  saveTasks();

  input.value = "";
}

// Create Task
function createTask(taskText) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = taskText;

  // Complete Task
  span.addEventListener("click", function () {
    span.classList.toggle("completed");
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "DELETE";

  // Delete Task
  deleteBtn.addEventListener("click", function () {
    li.remove();
    saveTasks();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}

// Save Tasks
function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.querySelector("span").classList.contains("completed"),
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    span.addEventListener("click", function () {
      span.classList.toggle("completed");
      saveTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "DELETE";

    deleteBtn.addEventListener("click", function () {
      li.remove();
      saveTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Page Load
loadTasks();

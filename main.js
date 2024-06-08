// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Variables >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Selecting DOM elements for later use
const taskInput = document.querySelector("input.task-input");
const addBtn = document.querySelector("button.add");
const clearBtn = document.querySelector("button.clear");
const taskList = document.querySelector("ul.task-list");
const taskCounter = document.querySelector("p.task-counter");

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Event Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Load tasks from localStorage when DOM content is loaded
document.addEventListener("DOMContentLoaded", (e) => {
  // Retrieve tasks from local storage
  let tasksFromStorage = JSON.parse(localStorage.getItem("tasks"));

  // If tasks exist in local storage, create HTML elements for each task and append them to the task list
  if (tasksFromStorage !== null && tasksFromStorage.length > 0) {
    tasksFromStorage.forEach((task, i) => {
      // Create HTML element for the task
      let newTask = createHtmlStack(task);

      // Add a transition delay for each task to create a staggered effect
      newTask.style.transitionDelay = 20 * i + "ms";

      // Append the task to the task list and remove the "done" class after a delay to animate the task
      taskList.append(newTask);
      setTimeout(() => {
        newTask.classList.remove("done");
      }, 20);
    });
  }

  // Update the task counter
  updateTaskCounter();
});

// Add a new task when the add button is clicked
addBtn.addEventListener("click", function (event) {
  if (taskInput.value.trim() !== "") {
    // Create HTML element for the new task
    let newTask = createHtmlStack(taskInput.value);

    // Append the new task to the task list and remove the "done" class after a delay to animate the task
    taskList.append(newTask);
    setTimeout(() => {
      newTask.classList.remove("done");
    }, 20);
  }

  // Clear the task input field, update the task counter, and update local storage
  taskInput.value = "";
  updateTaskCounter();
  updateStorage();
});

// Clear all tasks when the clear button is clicked
clearBtn.addEventListener("click", function (event) {
  // Add the "done" class to each task to mark them as completed
  let tasks = Array.from(taskList.querySelectorAll(".task"));
  tasks.forEach((task, i) => {
    task.style.transitionDelay = 20 * i + "ms";
    task.classList.add("done");
  });
});

// Mark a task as done when its state changes (checkbox is checked)
taskList.addEventListener("change", (e) => {
  let targetTask = e.target.closest(".task");
  targetTask?.classList.add("done");
  updateTaskCounter();
  updateStorage();
});

// Remove a task after its transition ends
taskList.addEventListener("transitionend", (e) => {
  if (getComputedStyle(e.target).opacity === "0") {
    e.target.remove();
    updateTaskCounter();
    updateStorage();
  }
});

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Update the task counter text and toggle the "No tasks" message
function updateTaskCounter() {
  let tasksCount = taskList.querySelectorAll(".task").length;
  taskCounter.innerHTML = `You have ${tasksCount} ToDo`;

  // Show or hide the "No tasks" message based on the number of tasks
  if (tasksCount === 0) {
    taskList.querySelector(".empty").hidden = false;
  } else {
    taskList.querySelector(".empty").hidden = true;
  }
}

// Create a new task HTML element
function createHtmlStack(content) {
  let task = document.createElement("li");

  task.classList.add("task");
  task.classList.add("done");
  task.innerHTML = `<input type="checkbox" class="state">
            <p class="task-content">
                ${content}
            </p>`;
  return task;
}

// Update localStorage with the current list of tasks
function updateStorage() {
  // Retrieve the content of each task and store it in an array
  let tasksFromList = Array.from(taskList.querySelectorAll(".task")).map(
    (task) => {
      return task.querySelector(".task-content").innerText;
    }
  );

  // Store the array of task content in localStorage as JSON
  localStorage.setItem("tasks", JSON.stringify(tasksFromList));
}

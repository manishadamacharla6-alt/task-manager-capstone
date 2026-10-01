const API_URL = "https://jsonplaceholder.typicode.com/todos";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const loading = document.getElementById("loading");

let tasks = [];

// Fetch tasks from REST API
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}?_limit=10`);

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        tasks = await response.json();

        loading.style.display = "none";
        displayTasks();
    } catch (error) {
        loading.textContent = "Unable to load tasks.";
        console.error(error);
    }
}

// Display tasks dynamically
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-item";

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        if (task.completed) {
            title.style.textDecoration = "line-through";
        }

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.appendChild(title);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

// Add new task using POST request
async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                completed: false,
                userId: 1
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        const newTask = await response.json();

        // JSONPlaceholder returns a simulated ID
        newTask.id = Date.now();

        tasks.unshift(newTask);

        taskInput.value = "";
        displayTasks();
    } catch (error) {
        console.error(error);
        alert("Unable to add task.");
    }
}

// Delete task from UI
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        tasks = tasks.filter((task) => task.id !== id);

        displayTasks();
    } catch (error) {
        console.error(error);
    }
}

// Add task button
addTaskBtn.addEventListener("click", addTask);

// Allow Enter key to add task
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load initial data
loadTasks();

let dateInput = document.getElementById("date-input");
let selectDateBtn = document.getElementById("select-date-btn");
let todoSection = document.getElementById("todo-section");
let selectedDateDisplay = document.getElementById("selected-date");
let completionPercentageDisplay = document.getElementById("completion-percentage");
let progressBar = document.getElementById("progress-bar");

let taskInput = document.getElementById("task-input");
let requiredHoursInput = document.getElementById("required-hours"); // Input for required hours
let addTaskBtn = document.getElementById("add-task-btn");
let taskList = document.getElementById("task-list");

let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};

selectDateBtn.addEventListener("click", () => {
    let selectedDate = dateInput.value;

    if (selectedDate !== "") {
        selectedDateDisplay.textContent = selectedDate;
        todoSection.style.display = "block"; // Show the to-do section
        renderTasks(selectedDate);
    }
});

addTaskBtn.addEventListener("click", () => {
    let selectedDate = dateInput.value;
    let task = taskInput.value.trim();
    let requiredHours = parseFloat(requiredHoursInput.value); // Get required hours

    if (task !== "" && !isNaN(requiredHours)) {
        if (!tasksByDate[selectedDate]) {
            tasksByDate[selectedDate] = [];
        }

        tasksByDate[selectedDate].push({ text: task, requiredHours: requiredHours, completed: false });
        localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
        taskInput.value = "";
        requiredHoursInput.value = ""; // Clear required hours input
        renderTasks(selectedDate);
    }
});

function renderTasks(selectedDate) {
    taskList.innerHTML = "";
    completionPercentageDisplay.innerHTML = ""; // Clear previous percentage display

    let tasks = tasksByDate[selectedDate] || [];
    let totalTasks = tasks.length;
    let completedTasks = tasks.filter(task => task.completed).length;

    // Calculate percentage of completed tasks
    let completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Display completion percentage
    completionPercentageDisplay.textContent = `Completion: ${completionPercentage.toFixed(2)}%`;

    // Draw the circular progress bar
    drawProgressBar(completionPercentage);

    let totalRequiredHours = 0; // Initialize total required hours

    tasks.forEach((task, index) => {
        let taskElement = document.createElement("li");
        taskElement.classList.add("task-row");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
            renderTasks(selectedDate);
        });

        let taskText = document.createElement("span");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        let requiredHoursText = document.createElement("span");
        requiredHoursText.textContent = ` (Required: ${task.requiredHours} hrs)`; // Show required hours
        taskText.appendChild(requiredHoursText); // Append to task text

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
            tasksByDate[selectedDate].splice(index, 1);
            localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
            renderTasks(selectedDate);
        });

        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskText);
        taskElement.appendChild(removeBtn);
        taskList.appendChild(taskElement);

        totalRequiredHours += task.requiredHours; // Calculate total required hours
    });

    // Display total required hours
    let totalHoursElement = document.createElement("div");
    totalHoursElement.textContent = `Total Required Hours: ${totalRequiredHours} hrs`;
    totalHoursElement.style.fontWeight = "bold";
    totalHoursElement.style.marginTop = "10px";
    taskList.appendChild(totalHoursElement);
}

function drawProgressBar(percentage) {
    const ctx = progressBar.getContext("2d");
    ctx.clearRect(0, 0, progressBar.width, progressBar.height); // Clear the canvas

    const centerX = progressBar.width / 2;
    const centerY = progressBar.height / 2;
    const radius = 40; // Radius of the circle
    const startAngle = -0.5 * Math.PI; // Start at the top

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ddd"; // Light gray for the background circle
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw completion arc
    ctx.beginPath();
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = "#4CAF50"; // Green for the completion arc
    ctx.lineWidth = 10;
    ctx.stroke();
}

// Initialize tasks if a date is already selected
if (dateInput.value) {
    renderTasks(dateInput.value);
}

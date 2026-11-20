
const API = "/api/tasks";

const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

async function loadTasks() {
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error("Failed to load tasks");

        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task";

            const heading = document.createElement("h3");
            heading.textContent = task.title;

            const description = document.createElement("p");
            description.textContent = task.description || "No description";

            const status = document.createElement("p");
            status.textContent = "Status: " + task.status;

            const button = document.createElement("button");
            button.className = "delete-btn";
            button.textContent = "Delete";

            button.addEventListener("click", () => {
                deleteTask(task._id);
            });

            div.append(heading, description, status, button);
            taskList.appendChild(div);
        });
    } catch (error) {
        taskList.textContent = "Unable to load tasks.";
        console.error(error);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                status: "pending"
            })
        });

        if (!response.ok) throw new Error("Task creation failed");

        form.reset();
        loadTasks();
    } catch (error) {
        alert(error.message);
    }
});

async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Delete failed");

        loadTasks();
    } catch (error) {
        alert(error.message);
    }
}

loadTasks();

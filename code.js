// DOM Elements
let v = document.querySelector("#input");
let a = document.querySelector("#add");
let d = document.querySelector("#del");
let u = document.getElementById("updt");
let s = document.getElementById("show");
let l = document.querySelector(".list");
let progressBar = document.getElementById("progress-bar");
let progressText = document.getElementById("progress-text");

// Load initial data from LocalStorage or fallback to empty arrays
let arr = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completed')) || new Array(arr.length).fill(false);

// If arrays got out of sync, fix length of completedTasks
if (completedTasks.length !== arr.length) {
    completedTasks = new Array(arr.length).fill(false);
}

// Save Data Helper
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(arr));
    localStorage.setItem('completed', JSON.stringify(completedTasks));
}

// Custom Toast Notifications
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    let toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    
    // Auto-remove animation
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 2800);
}

// Custom Glassmorphic Prompt Modals
function customPrompt(title, defaultValue, callback) {
    let overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    let card = document.createElement('div');
    card.className = 'modal-card';
    
    let titleEl = document.createElement('div');
    titleEl.className = 'modal-title';
    titleEl.innerText = title;
    
    let bodyEl = document.createElement('div');
    bodyEl.className = 'modal-body';
    
    let inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'modal-prompt-input';
    inputEl.value = defaultValue || '';
    inputEl.placeholder = 'Type here...';
    bodyEl.appendChild(inputEl);
    
    let actionsEl = document.createElement('div');
    actionsEl.className = 'modal-actions';
    
    let cancelBtn = document.createElement('button');
    cancelBtn.className = 'modal-btn modal-btn-cancel';
    cancelBtn.innerText = 'Cancel';
    
    let confirmBtn = document.createElement('button');
    confirmBtn.className = 'modal-btn modal-btn-confirm';
    confirmBtn.innerText = 'Confirm';
    
    actionsEl.appendChild(cancelBtn);
    actionsEl.appendChild(confirmBtn);
    
    card.appendChild(titleEl);
    card.appendChild(bodyEl);
    card.appendChild(actionsEl);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    // Trigger modal enter animation
    setTimeout(() => overlay.classList.add('active'), 10);
    inputEl.focus();
    inputEl.select();
    
    function close() {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 250);
    }
    
    cancelBtn.addEventListener('click', () => {
        close();
        callback(null);
    });
    
    confirmBtn.addEventListener('click', () => {
        let val = inputEl.value.trim();
        close();
        callback(val);
    });
    
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        } else if (e.key === 'Escape') {
            cancelBtn.click();
        }
    });
}

// Render List & Progress Metrics
function renderList() {
    l.innerHTML = "";
    
    // Update Progress Metrics
    let total = arr.length;
    let completed = completedTasks.filter(Boolean).length;
    let percentage = total > 0 ? (completed / total) * 100 : 0;
    
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${completed} of ${total} completed`;
    
    if (total === 0) {
        // Render beautiful empty state
        let emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = `
            <div class="empty-icon">📝</div>
            <div class="empty-text">No tasks yet. Create one above!</div>
        `;
        l.appendChild(emptyState);
        return;
    }
    
    arr.forEach((task, index) => {
        let item = document.createElement("li");
        if (completedTasks[index]) {
            item.classList.add("completed");
        }
        
        // Left side: checkbox and task text click to toggle completion
        let taskContent = document.createElement("div");
        taskContent.className = "task-content";
        
        let checkbox = document.createElement("span");
        checkbox.className = "task-checkbox";
        
        let textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.innerText = task;
        
        taskContent.appendChild(checkbox);
        taskContent.appendChild(textSpan);
        
        taskContent.addEventListener("click", () => {
            completedTasks[index] = !completedTasks[index];
            saveData();
            renderList();
        });
        
        // Right side: Action buttons
        let actions = document.createElement("div");
        actions.className = "task-actions";
        
        // Edit Action
        let editBtn = document.createElement("button");
        editBtn.className = "action-btn edit-btn";
        editBtn.title = "Edit Task";
        editBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        `;
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent completed toggle
            customPrompt("Edit task", task, function(newVal) {
                if (newVal !== null && newVal.trim() !== "") {
                    arr[index] = newVal.trim();
                    saveData();
                    renderList();
                    showToast("Task updated", "info");
                }
            });
        });
        
        // Delete Action
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn delete-btn";
        deleteBtn.title = "Delete Task";
        deleteBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        `;
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent completed toggle
            arr.splice(index, 1);
            completedTasks.splice(index, 1);
            saveData();
            renderList();
            showToast("Task deleted", "error");
        });
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        item.appendChild(taskContent);
        item.appendChild(actions);
        l.appendChild(item);
    });
}

// Add Task Button
a.addEventListener("click", function() {
    let taskText = v.value.trim();
    if (taskText !== "") {
        arr.push(taskText);
        completedTasks.push(false);
        saveData();
        renderList();
        showToast("Task Added successfully!!", "success");
        v.value = "";
        v.focus();
    } else {
        showToast("Enter any Task", "error");
    }
});

// Allow Enter key on input to add task
v.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        a.click();
    }
});

// Delete Task button (Original behavior matching text input value)
d.addEventListener("click", function() {
    let targetText = v.value.trim();
    if (targetText !== "") {
        let index = arr.indexOf(targetText);
        if (index !== -1) {
            arr.splice(index, 1);
            completedTasks.splice(index, 1);
            saveData();
            renderList();
            showToast("Task Deleted", "error");
            v.value = "";
        } else {
            showToast("No task found", "error");
        }
    } else {
        showToast("No task found", "error");
    }
});

// Update Task button (Original prompt-based behavior matching input text value)
u.addEventListener("click", function() {
    let currentInput = v.value.trim();
    if (currentInput === "") {
        showToast("No task found", "error");
        return;
    }
    
    customPrompt("Enter the task you want to update!", currentInput, function(n) {
        if (n === null) return;
        if (currentInput === n) {
            customPrompt("Enter the new task", "", function(nn) {
                if (nn === null) return;
                if (nn.trim() !== "") {
                    let index = arr.indexOf(currentInput);
                    if (index !== -1) {
                        arr.splice(index, 1, nn.trim());
                        saveData();
                        renderList();
                        showToast("Task Updated", "info");
                        v.value = "";
                    } else {
                        showToast("No task found", "error");
                    }
                } else {
                    showToast("Task text cannot be empty", "error");
                }
            });
        } else {
            showToast("No task found", "error");
        }
    });
});

// Show the list button
s.addEventListener("click", function () {
    if (arr.length > 0) {
        renderList();
        showToast("List updated!", "success");
    } else {
        showToast("No task to show", "error");
    }
});

// Initial Render on page load
renderList();

// DOM Elements
const authButtons = document.getElementById("auth-buttons");
const todoSection = document.getElementById("todo-section");
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const saveSettingsBtn = document.getElementById("save-settings");
const nameInput = document.getElementById("name-input");
const resetTimeInput = document.getElementById("reset-time");
const uploadPhotoInput = document.getElementById("upload-photo");
const accountPhotoImg = document.getElementById("account-photo-img");

let tasks = [];

// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-In
const googleSignInBtn = document.getElementById("google-signin-btn");
googleSignInBtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Google Sign-In Success:", user);
            showTodoSection();
        })
        .catch((error) => {
            console.error("Google Sign-In Error:", error);
        });
});

// Save Tasks to Firestore
async function saveTasks(userId, tasks) {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { tasks: tasks }, { merge: true });
    console.log("Tasks saved:", tasks); // Debugging
}

// Load Tasks from Firestore
async function loadTasks(userId) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const tasks = userDoc.data().tasks || []; // Load tasks from Firestore
        console.log("Tasks loaded:", tasks); // Debugging
        return tasks;
    }
    return []; // Return empty array if no tasks exist
}

// Save Settings to Firestore
async function saveSettings(userId, settings) {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { settings: settings }, { merge: true });
}

// Load Settings from Firestore
async function loadSettings(userId) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().settings) {
        return userDoc.data().settings;
    }
    return {
        name: "",
        resetTime: "00:00"
    };
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = ""; // Clear the task list
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <select onchange="updateTaskType(${index}, this.value)">
                    <option value="one-time" ${task.type === "one-time" ? "selected" : ""}>Однократно</option>
                    <option value="daily" ${task.type === "daily" ? "selected" : ""}>Ежедневно</option>
                </select>
                <button onclick="deleteTask(${index})">❌</button>
                <button onclick="editTask(${index})">✏️</button>
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
            </div>
        `;
        if (task.completed) li.classList.add("completed");
        taskList.appendChild(li);
    });
    updateProgress();
}

// Update Task Type
window.updateTaskType = function (index, newType) {
    tasks[index].type = newType; // Update task type
    saveTasks(auth.currentUser.uid, tasks); // Save updated tasks to Firestore
    renderTasks(); // Render the updated task list
};

window.editTask = function (index) {
    const newText = prompt("Редактировать задачу:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
        renderTasks();
    }
};

// Toggle Task Completion
window.toggleTask = function (index) {
    tasks[index].completed = !tasks[index].completed; // Toggle completion status
    saveTasks(auth.currentUser.uid, tasks); // Save updated tasks to Firestore
    renderTasks(); // Render the updated task list
};

// Delete Task
window.deleteTask = function (index) {
    if (confirm("Вы уверены, что хотите удалить задачу?")) {
        tasks.splice(index, 1); // Remove the task
        saveTasks(auth.currentUser.uid, tasks); // Save updated tasks to Firestore
        renderTasks(); // Render the updated task list
    }
};

// Edit Task
window.editTask = function (index) {
    const newText = prompt("Редактировать задачу:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim(); // Update task text
        saveTasks(auth.currentUser.uid, tasks); // Save updated tasks to Firestore
        renderTasks(); // Render the updated task list
    }
};

// Add Task
addTaskBtn.addEventListener("click", async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false, type: "one-time" }); // Add new task
        taskInput.value = ""; // Clear the input field
        await saveTasks(auth.currentUser.uid, tasks); // Save tasks to Firestore
        renderTasks(); // Render the updated task list
    }
});

window.addEventListener("beforeunload", async () => {
    if (auth.currentUser) {
        await saveTasks(auth.currentUser.uid, tasks);
    }
});

// Update Progress
function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progressPercent.textContent = `${progress.toFixed(0)}%`;
    progressBar.value = progress;
}

// Daily Reset
function dailyReset() {
    tasks.forEach(task => {
        if (task.type === "daily") task.completed = false;
    });
    saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
    renderTasks();
}

// Show To-Do Section After Login
function showTodoSection() {
    authButtons.classList.add("hidden");
    todoSection.classList.remove("hidden");
}

// Settings Panel
settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("visible");
});

// Save Settings
saveSettingsBtn.addEventListener("click", async () => {
    const settings = {
        name: nameInput.value,
        photoUrl: accountPhotoImg.src,
        resetTime: resetTimeInput.value
    };
    await saveSettings(auth.currentUser.uid, settings);
    alert("Настройки сохранены!");
});

// Upload Photo
uploadPhotoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            accountPhotoImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Check Auth State and Load Tasks/Settings
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is signed in:", user);
        tasks = await loadTasks(user.uid); // Load tasks for the logged-in user
        const settings = await loadSettings(user.uid); // Load settings for the logged-in user
        nameInput.value = settings.name || ""; // Default to empty if no name
        accountPhotoImg.src = settings.photoUrl || "user.png"; // Default image if no photo
        resetTimeInput.value = settings.resetTime || "00:00"; // Default reset time
        renderTasks(); // Render tasks after loading
        showTodoSection(); // Show the to-do section

        // Real-Time Updates (optional)
        const userDocRef = doc(db, "users", user.uid);
        onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                tasks = doc.data().tasks || []; // Update tasks in real-time
                renderTasks();
            }
        });
    } else {
        console.log("User is signed out");
        tasks = []; // Clear tasks when the user logs out
        renderTasks();
    }
});

// Initial Render
renderTasks();
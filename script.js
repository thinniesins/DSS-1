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
const taskTypeSelect = document.getElementById("task-type"); // Add this

let tasks = [];

// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCN-TMHJqEjJ2s-2AR3oWkRoXseWCiqeYk",
    authDomain: "dss-website-be534.firebaseapp.com",
    projectId: "dss-website-be534",
    storageBucket: "dss-website-be534.appspot.com",
    messagingSenderId: "521888020881",
    appId: "1:521888020881:web:a2ff05a054b039b6740230",
    measurementId: "G-YEMTJV5R0T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

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

// VK Sign-In
const vkSignInBtn = document.getElementById("vk-signin-btn");
vkSignInBtn.addEventListener("click", () => {
    const vkAppId = "53080924"; 
    const redirectUri = encodeURIComponent("https://your-actual-domain.com/"); // Update this
    const vkAuthUrl = `https://oauth.vk.com/authorize?client_id=${vkAppId}&display=page&redirect_uri=${redirectUri}&response_type=code&v=5.131`;
    window.location.href = vkAuthUrl; // Redirect to VK OAuth page
});

// Save Tasks to Firestore
async function saveTasks(userId, tasks) {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { tasks: tasks }, { merge: true });
    console.log("Tasks saved:", tasks);
}

// Load Tasks from Firestore
async function loadTasks(userId) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const tasks = userDoc.data().tasks || [];
        console.log("Tasks loaded:", tasks);
        return tasks;
    }
    return [];
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
            <span>${task.text} (${task.type === "daily" ? "Ежедневно" : "Однократно"})</span>
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
    tasks[index].type = newType;
    saveTasks(auth.currentUser.uid, tasks);
    renderTasks();
};

// Edit Task
window.editTask = function (index) {
    const newText = prompt("Редактировать задачу:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks(auth.currentUser.uid, tasks);
        renderTasks();
    }
};

// Toggle Task Completion
window.toggleTask = function (index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(auth.currentUser.uid, tasks);
    renderTasks();
};

// Delete Task
window.deleteTask = function (index) {
    if (confirm("Вы уверены, что хотите удалить задачу?")) {
        tasks.splice(index, 1);
        saveTasks(auth.currentUser.uid, tasks);
        renderTasks();
    }
};

// Add Task
addTaskBtn.addEventListener("click", async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskType = taskTypeSelect.value; // Get the selected task type
        tasks.push({ text: taskText, completed: false, type: taskType }); // Use the selected type
        taskInput.value = "";
        await saveTasks(auth.currentUser.uid, tasks);
        renderTasks();
    }
});

// Add Task on Enter
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskType = taskTypeSelect.value; // Get the selected task type
            tasks.push({ text: taskText, completed: false, type: taskType }); // Use the selected type
            taskInput.value = "";
            saveTasks(auth.currentUser.uid, tasks);
            renderTasks();
        }
    }
});

// Toggle Task Completion on Click
taskList.addEventListener("click", (event) => {
    if (event.target.tagName === "SPAN") {
        const taskIndex = Array.from(taskList.children).indexOf(event.target.parentElement);
        tasks[taskIndex].completed = !tasks[taskIndex].completed; // Toggle completion status
        saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
        renderTasks(); // Re-render tasks
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
    saveTasks(auth.currentUser.uid, tasks);
    renderTasks();
}

// Show To-Do Section After Login
function showTodoSection() {
    authButtons.classList.add("hidden");
    todoSection.classList.remove("hidden");
}

// Settings Panel
settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden"); // Toggle the "hidden" class
});

// Close settings panel
const closeSettingsBtn = document.getElementById("close-settings-btn");
closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.add("hidden"); // Hide the settings panel
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
        tasks = await loadTasks(user.uid);
        const settings = await loadSettings(user.uid);
        nameInput.value = settings.name || "";
        accountPhotoImg.src = settings.photoUrl || "user.png";
        resetTimeInput.value = settings.resetTime || "00:00";
        renderTasks();
        showTodoSection();

        // Real-Time Updates
        const userDocRef = doc(db, "users", user.uid);
        onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                tasks = doc.data().tasks || [];
                renderTasks();
            }
        });
    } else {
        console.log("User is signed out");
        tasks = [];
        renderTasks();
    }
});

// Initial Render
renderTasks();
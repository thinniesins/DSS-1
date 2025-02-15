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
}

// Load Tasks from Firestore
async function loadTasks(userId) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return userDoc.data().tasks || [];
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
        photoUrl: "https://via.placeholder.com/100",
        resetTime: "00:00"
    };
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <select onchange="updateTaskType(${index}, this.value)">
                    <option value="one-time" ${task.type === "one-time" ? "selected" : ""}>Однократно</option>
                    <option value="daily" ${task.type === "daily" ? "selected" : ""}>Ежедневно</option>
                </select>
                <button onclick="deleteTask(${index})">🗑️</button>
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
    saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
    renderTasks();
};

// Toggle Task Completion
window.toggleTask = function (index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
    renderTasks();
};

// Delete Task
window.deleteTask = function (index) {
    if (confirm("Вы уверены, что хотите удалить задачу?")) {
        tasks.splice(index, 1);
        saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
        renderTasks();
    }
};

// Edit Task
window.editTask = function (index) {
    const newType = prompt("Изменить тип задачи (daily/one-time):", tasks[index].type);
    if (newType === "daily" || newType === "one-time") {
        tasks[index].type = newType;
        saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
        renderTasks();
    }
};

// Add Task
addTaskBtn.addEventListener("click", async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false, type: "one-time" });
        taskInput.value = "";
        await saveTasks(auth.currentUser.uid, tasks); // Save new task
        renderTasks();
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
        nameInput.value = settings.name;
        accountPhotoImg.src = settings.photoUrl;
        resetTimeInput.value = settings.resetTime;
        renderTasks();
        showTodoSection();

        // Real-Time Updates (optional)
        const userDocRef = doc(db, "users", user.uid);
        onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                tasks = doc.data().tasks || [];
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
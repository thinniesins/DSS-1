// DOM Elements
const authButtons = document.getElementById("auth-buttons");
const todoSection = document.getElementById("todo-section");
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");

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

// Render Tasks
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.text}</span>
            <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
        `;
        taskList.appendChild(li);
    });
    updateProgress();
}

// Toggle Task Completion
window.toggleTask = function (index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(auth.currentUser.uid, tasks); // Save updated tasks
    renderTasks();
};

// Add Task
addTaskBtn.addEventListener("click", async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
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

// Show To-Do Section After Login
function showTodoSection() {
    authButtons.classList.add("hidden");
    todoSection.classList.remove("hidden");
}

// Check Auth State and Load Tasks
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is signed in:", user);
        tasks = await loadTasks(user.uid); // Load tasks for the logged-in user
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
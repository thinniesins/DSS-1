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
const taskTypeSelect = document.getElementById("task-type");
const allTasks = [
    "Сделать 20 отжиманий",
    "Взять обет на день",
    "Практиковать осознание смерти (размышлять о конечности жизни)",
    "Заняться творчеством",
    "Практиковать хобби",
    "Практиковать целительство (например, помочь кому-то советом)",
    "Почувствовать связь с планетой (например, прогуляться босиком по траве)",
    "Записать сон утром",
    "Принять контрастный душ",
    "Практиковать концентрацию на объекте (например, на пламени свечи)",
    "Медитировать 10 минут",
    "Медитировать во время ходьбы",
    "Стоять в планке 1 минуту",
    "Написать завещание (или обновить существующее)",
    "Написать стихотворение",
    "Общаться с растениями (например, поливать цветы и говорить с ними)",
    "Завести одно новое знакомство",
    "Изучить новую методику осознанных сновидений",
    "Ощущать связь с окружающей вселенной (например, наблюдать за звездами)",
    "Ощущать свои чакры (например, визуализировать их)",
    "Перепроверить свой икигаи (цель жизни)",
    "Перепроверить план на жизнь",
    "Петь мантры",
    "Принять витаминный комплекс",
    "Выпить грудной сбор",
    "Принять аскорбиновую кислоту",
    "Принять рыбий жир",
    "Выпить свежевыжатый сок",
    "Принять семена льна",
    "Принять спирулину",
    "Пить только воду и чай в течение дня",
    "Выпить чашку улуна",
    "Практиковать асаны йоги",
    "Практиковать ката каратэ",
    "Практиковать формы тайцзицюань",
    "Лежать на гвоздях (например, на доске Садху)",
    "Пополнить брокерский счет",
    "Пополнить сберегательный счет",
    "Посетить вечеринку или социальное мероприятие",
    "Посетить дацан (буддийский храм)",
    "Посетить место силы (например, гору или лес)",
    "Посетить мечеть",
    "Посетить синагогу",
    "Посетить церковь",
    "Постоять на гвоздях (например, на доске Садху)",
    "Пробежать 1 километр",
    "Провести гадание (например, на картах Таро)",
    "Провести уборку в доме",
    "Провести чайную церемонию",
    "Проветрить комнату",
    "Пройти 10 000 шагов",
    "Пройти детоксикацию (например, пить только воду и травяные чаи)",
    "Противостоять привязанности (например, отказаться от чего-то привычного)",
    "Прочитать молитву",
    "Развивать вестибулярный аппарат (например, стоять на одной ноге)",
    "Развивать интуицию (например, угадывать у генератора случайных чисел)",
    "Развивать нейропластичность (например, выучить новое слово на иностранном языке)",
    "Практиковать самонаблюдение (например, вести дневник)",
    "Сделать доброе дело",
    "Сделать задержку дыхания на выдохе",
    "Сделать массаж",
    "Сделать массаж лица",
    "Практиковать нади шодхану",
    "Практиковать пальминг",
    "Сделать подарок кому-то",
    "Сделать пожертвование",
    "Сделать разминку для глаз",
    "Сделать растяжку",
    "Пойти на свидание с природой (например, прогуляться в лесу)",
    "Сделать скрутку",
    "Практиковать сканирование ауры (например, визуализировать энергетическое поле)",
    "Служить другим (например, помочь соседу)",
    "Слушать деревья",
    "Совершить длинную прогулку (например, 5 километров)",
    "Составлять карту снов",
    "Спеть песню",
    "Сделать Сурья Намаскар",
    "Съесть дольку горького шоколада",
    "Съесть зубчик чеснока",
    "Съесть ложку меда",
    "Съесть ложку орехов",
    "Съесть семена подсолнуха",
    "Съесть тарелку супа",
    "Съесть тарелку фруктов",
    "Съесть тарелку ягод",
    "Трансформировать сексуальную энергию (например, через Око Возрождения)",
    "Тренировать память (например, выучить стихотворение)",
    "Читать аффирмации",
    "Читать книгу"
];

let tasks = [];
let suggestedTasks = []; // Track suggested tasks

// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
// Import Firebase signOut function
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCN-TMHJqEjJ2s-2AR3oWkRoXseWCiqeYk",
    authDomain: "dss-website-be534.firebaseapp.com",
    projectId: "dss-website-be534",
    storageBucket: "dss-website-be534.appspot.com",
    messagingSenderId: "521888020881",
    appId: "1:521888020881:web:a2ff05a054b039b6740230",
    measurementId: "G-YEMTJV5R0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Set persistence based on platform
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobile device: use session persistence
    setPersistence(auth, browserSessionPersistence)
        .then(() => console.log("Session persistence set for mobile devices"))
        .catch((error) => console.error("Error setting persistence:", error));
} else {
    // Desktop: use local persistence
    setPersistence(auth, browserLocalPersistence)
        .then(() => console.log("Local persistence set for desktop devices"))
        .catch((error) => console.error("Error setting persistence:", error));
}

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
    console.log("Settings button clicked!");
    settingsPanel.classList.toggle("hidden");
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

        // Show and activate the settings button after login
        const settingsBtn = document.getElementById("settings-btn");
        settingsBtn.classList.add("active"); // Make the button visible
        settingsBtn.disabled = false; // Enable the button

        // Check if it's a new day and recommend a task ONLY AFTER LOGIN
        if (isNewDay()) {
            recommendTask();
        }
    } else {
        console.log("User is signed out");
        // Hide the to-do section and show the login buttons
        authButtons.classList.remove("hidden");
        todoSection.classList.add("hidden");

        // Hide and deactivate the settings button
        const settingsBtn = document.getElementById("settings-btn");
        settingsBtn.classList.remove("active"); // Hide the button
        settingsBtn.disabled = true; // Disable the button

        // Clear tasks
        tasks = [];
        renderTasks();
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        tasks = await loadTasks(user.uid);
        renderTasks();
        recommendTask(); // Show recommendation
    }
});

function isNewDay() {
    const lastSuggestionDate = localStorage.getItem("lastSuggestionDate");
    const today = new Date().toDateString(); // Get today's date as a string

    // If there's no last suggestion date or it's a new day, return true
    return !lastSuggestionDate || lastSuggestionDate !== today;
}

// Call this function before recommending a task
if (isNewDay()) {
    recommendTask();
}

function recommendTask() {
    // Get the last suggestion date from localStorage
    const lastSuggestionDate = localStorage.getItem("lastSuggestionDate");
    const today = new Date().toDateString();

    // Check if a task was already suggested today
    if (lastSuggestionDate === today) {
        console.log("Task already suggested today.");
        return;
    }

    // Filter out tasks that have already been suggested
    const availableTasks = allTasks.filter(task => !suggestedTasks.includes(task));

    if (availableTasks.length > 0) {
        const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
        suggestedTasks.push(randomTask); // Add to suggested tasks

        // Show recommendation modal
        showRecommendationModal(randomTask);

        // Update the last suggestion date in localStorage
        localStorage.setItem("lastSuggestionDate", today);
    } else {
        alert("Все задачи были предложены!");
    }
}

// Log Out Button
const logOutBtn = document.getElementById("log-out-btn");

logOutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out successfully");
            // Hide the to-do section and show the login buttons
            authButtons.classList.remove("hidden");
            todoSection.classList.add("hidden");
            // Clear tasks
            tasks = [];
            renderTasks();
            // Close the settings panel
            settingsPanel.classList.add("hidden");
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});
    function showRecommendationModal(task) {
    // Create modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content animate__animated animate__slideInDown";
    modalContent.innerHTML = `
        <h3>Рекомендация на сегодня</h3>
        <p>${task}</p>
        <button id="accept-task">Принять</button>
        <button id="decline-task">Отклонить</button>
    `;

    // Append modal content to overlay
    modalOverlay.appendChild(modalContent);

    // Append modal overlay to body
    document.body.appendChild(modalOverlay);

    // Function to close the modal with exit animation
    function closeModal() {
        modalContent.classList.remove("animate__slideInDown"); // Remove initial animation
        modalContent.classList.add("animate__slideOutUp"); // Add exit animation

        // Remove the modal from the DOM after the animation completes
        setTimeout(() => {
            modalOverlay.remove();
        }, 300); // Match the animation duration (300ms for slideOutUp)
    }

    // Handle accept button click
    document.getElementById("accept-task").addEventListener("click", () => {
        tasks.push({ text: task, completed: false, type: "daily" });
        saveTasks(auth.currentUser.uid, tasks);
        renderTasks();
        modalOverlay.remove(); // Remove modal
    });

    // Handle decline button click
    document.getElementById("decline-task").addEventListener("click", () => {
        modalOverlay.remove(); // Remove modal
    });

    // Close modal when clicking outside
    modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

// Initial Render
renderTasks();
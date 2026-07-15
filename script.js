// =======================
// DATA
// =======================

let subjects = [];

try {
    subjects = JSON.parse(localStorage.getItem("subjects")) || [];
} catch (e) {
    subjects = [];
}

subjects.forEach(sub => {
    if (!sub.tasks) sub.tasks = [];
    if (!sub.notes) sub.notes = [];
    if (typeof sub.sessions !== "number") sub.sessions = 0;
    if (typeof sub.streak !== "number") sub.streak = 0;
});

let currentSubject = null;
let chart;

// =======================
// SAVE
// =======================

function saveData() {
    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );
}

// =======================
// ADD SUBJECT
// =======================

function addSubject() {

    let input =
        document.getElementById("subjectInput");

    let name = input.value.trim();

    if (!name) {
        alert("Please enter a subject name");
        return;
    }

    subjects.push({
        name: name,
        tasks: [],
        notes: [],
        streak: 0,
        sessions: 0
    });

    input.value = "";

    saveData();
    renderSubjects();
}

// =======================
// DELETE SUBJECT
// =======================

function deleteSubject(index) {

    if (confirm("Delete this subject?")) {

        subjects.splice(index, 1);

        saveData();
        renderSubjects();
    }
}

// =======================
// RENDER SUBJECTS
// =======================

function renderSubjects() {

    let container =
        document.getElementById("subjectsContainer");

    if (!container) return;

    container.innerHTML = "";

let keyword =
document.getElementById("searchSubject")
.value
.toLowerCase();

    subjects.forEach((sub, index) => {

    let keyword = document.getElementById("searchSubject").value.trim().toLowerCase();

    if (keyword !== "" && !sub.name.toLowerCase().includes(keyword)) {
        return;
    }

if(
    !sub.name
    .toLowerCase()
    .includes(keyword)
)
return;

        let tasks = sub.tasks || [];

        let completed =
            tasks.filter(t => t.done).length;

        container.innerHTML += `

        <div class="subjectCard">

            <div
                class="subjectInfo"
                onclick="openDashboard(${index})"
            >

                <h2>📘 ${sub.name}</h2>

                <p>
                    📋 Total Tasks:
                    ${tasks.length}
                </p>

                <p>
                    ✅ Completed:
                    ${completed}
                </p>

            </div>

            <button onclick="deleteSubject(${index})">
                Delete Subject
            </button>

        </div>
        `;
    });
}

// =======================
// OPEN DASHBOARD
// =======================

function openDashboard(index){

    currentSubject = subjects[index];

    // SAFE FIX
    if(!currentSubject.tasks) currentSubject.tasks = [];
    if(!currentSubject.notes) currentSubject.notes = [];
    if(!currentSubject.sessions) currentSubject.sessions = 0;
    if(!currentSubject.streak) currentSubject.streak = 0;

    document.getElementById("homeScreen").style.display = "none";
    document.getElementById("dashboardScreen").style.display = "block";

    document.getElementById("subjectTitle").innerText =
        "📘 " + currentSubject.name;

    renderTasks();
    renderNotes();
    updateStats();
    updateChart();
}

// =======================
// BACK HOME
// =======================

function goHome(){

    currentSubject = null;

    document.getElementById("dashboardScreen").style.display = "none";
    document.getElementById("homeScreen").style.display = "block";

    renderSubjects();
}

// =======================
// TASKS
// =======================

function addTask(){

    if(!currentSubject) return alert("Select a subject first!");

    let input = document.getElementById("taskInput");
    let text = input.value.trim();

    if(!text) return;

    currentSubject.tasks.push({
        text: text,
        done: false
    });

    input.value = "";

    saveData();
    renderTasks();
    updateStats();
    updateChart();
}

function toggleTask(i){

    if(!currentSubject) return;

    currentSubject.tasks[i].done = !currentSubject.tasks[i].done;

    if(currentSubject.tasks[i].done){
        confetti();
    }

    saveData();
    renderTasks();
    updateStats();
    updateChart();
}

function deleteTask(i){

    if(!currentSubject) return;

    currentSubject.tasks.splice(i,1);

    saveData();
    renderTasks();
    updateStats();
    updateChart();
}

function renderTasks(){

    let container = document.getElementById("taskList");
    container.innerHTML = "";


let keyword =
document.getElementById("taskSearch")
.value
.toLowerCase();

    currentSubject.tasks.forEach((task,i)=>{

    let keyword = document.getElementById("taskSearch").value.trim().toLowerCase();

    if(keyword !== "" && !task.text.toLowerCase().includes(keyword)){
        return;
    }


if(
!task.text
.toLowerCase()
.includes(keyword)
)
return;

        container.innerHTML += `
        <div class="task">

            <h3>${task.text}</h3>

            <button onclick="toggleTask(${i})">
                ${task.done ? "Undo" : "Done"}
            </button>

            <button onclick="deleteTask(${i})">
                Delete
            </button>

        </div>`;
    });
}

// =======================
// NOTES
// =======================

function saveNote(){

    if(!currentSubject) return;

    let input = document.getElementById("noteInput");
    let text = input.value.trim();

    if(!text) return;

    currentSubject.notes.push(text);

    input.value = "";

    saveData();
    renderNotes();
}

function renderNotes(){

    let container = document.getElementById("notesContainer");
    container.innerHTML = "";

let keyword =
document.getElementById("noteSearch")
.value
.toLowerCase();

currentSubject.notes.forEach((note,index)=>{

    let keyword = document.getElementById("noteSearch").value.trim().toLowerCase();

    if(keyword !== "" && !note.toLowerCase().includes(keyword)){
        return;
    }


if(
!note
.toLowerCase()
.includes(keyword)
)
return;

        let div = document.createElement("div");

        div.className = "note";

div.innerHTML=`
${note}

<br><br>

<button onclick="deleteNote(${index})">
Delete
</button>
`;

        container.appendChild(div);

    });
}




function deleteNote(index){

if(
!confirm("Delete this note?")
)
return;

currentSubject.notes.splice(index,1);

saveData();

renderNotes();

}




// =======================
// STATS
// =======================

function updateStats(){

    if(!currentSubject) return;

    let completed = currentSubject.tasks.filter(t=>t.done).length;

    document.getElementById("taskCount").innerText = completed;
    document.getElementById("sessionCount").innerText = currentSubject.sessions;
    document.getElementById("streakCount").innerText = currentSubject.streak;
}

// =======================
// TIMER
// =======================

let totalSeconds = 25 * 60;
let timer;
let running = false;

function updateTimer(){

    let min = Math.floor(totalSeconds/60);
    let sec = totalSeconds%60;

    document.getElementById("timer").innerText =
        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function startTimer(){

    if(running || !currentSubject) return;

    running = true;

    timer = setInterval(()=>{

        totalSeconds--;
        updateTimer();

        if(totalSeconds <= 0){

            clearInterval(timer);
            running = false;

            currentSubject.sessions++;
            currentSubject.streak++;

            // SAVE BACK SAFE
            let sub = subjects.find(s=>s.name === currentSubject.name);
            if(sub){
                sub.sessions = currentSubject.sessions;
                sub.streak = currentSubject.streak;
            }

            saveData();

            confetti();
            alert("Study Session Completed!");

            totalSeconds = 25 * 60;
            updateTimer();
            updateStats();
        }

    },1000);
}

function pauseTimer(){
    clearInterval(timer);
    running = false;
}

function resetTimer(){
    clearInterval(timer);
    running = false;
    totalSeconds = 25 * 60;
    updateTimer();
}

updateTimer();

// =======================
// CHART
// =======================

function updateChart(){

    if(!currentSubject) return;

    let completed = currentSubject.tasks.filter(t=>t.done).length;
    let pending = currentSubject.tasks.length - completed;

    if(chart) chart.destroy();

    let ctx = document.getElementById("chart");

    if(!ctx) return;

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending]
            }]
        }
    });
}

// =======================
// INIT
// =======================

renderSubjects();

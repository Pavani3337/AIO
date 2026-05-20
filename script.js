// script.js

// ======================
// LOCAL STORAGE
// ======================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let streak = localStorage.getItem("streak") || 0;
let sessions = localStorage.getItem("sessions") || 0;

// ======================
// DASHBOARD UPDATE
// ======================

function updateDashboard(){

    document.getElementById("studyStreak").innerText = streak;

    document.getElementById("focusSessions").innerText = sessions;

    let completed = tasks.filter(t=>t.done).length;

    document.getElementById("completedTasks").innerText = completed;
}

// ======================
// TASKS
// ======================

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function addTask(){

    let text = document.getElementById("taskInput").value.trim();

    let subject = document.getElementById("subjectSelect").value;

    if(!text) return;

    tasks.push({
        text,
        subject,
        done:false
    });

    document.getElementById("taskInput").value="";

    saveTasks();

    renderTasks();

    updateChart();

    detectWeakSubject();
}

function toggleTask(i){

    tasks[i].done = !tasks[i].done;

    if(tasks[i].done){
        confetti();
    }

    saveTasks();

    renderTasks();

    updateDashboard();

    updateChart();
}

function deleteTask(i){

    tasks.splice(i,1);

    saveTasks();

    renderTasks();

    updateChart();

    detectWeakSubject();
}

function renderTasks(){

    let container = document.getElementById("taskList");

    container.innerHTML="";

    tasks.forEach((t,i)=>{

        container.innerHTML += `
        <div class="task">

            <h3>${t.text}</h3>

            <p>📘 ${t.subject}</p>

            <button onclick="toggleTask(${i})">
                ${t.done ? "Undo":"Done"}
            </button>

            <button onclick="deleteTask(${i})">
                Delete
            </button>

        </div>
        `;
    });

    updateDashboard();
}

// ======================
// TIMER
// ======================

let totalSeconds = 25*60;
let timer;
let running=false;

function updateTimer(){

    let min = Math.floor(totalSeconds/60);
    let sec = totalSeconds%60;

    document.getElementById("timer").innerText =
    `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function startTimer(){

    if(running) return;

    running=true;

    timer=setInterval(()=>{

        totalSeconds--;

        updateTimer();

        if(totalSeconds<=0){

            clearInterval(timer);

            running=false;

            sessions++;

            localStorage.setItem("sessions",sessions);

            streak++;

            localStorage.setItem("streak",streak);

            confetti();

            alert("Study Session Completed!");

            totalSeconds=25*60;

            updateTimer();

            updateDashboard();
        }

    },1000);
}

function pauseTimer(){
    clearInterval(timer);
    running=false;
}

function resetTimer(){

    clearInterval(timer);

    running=false;

    totalSeconds=25*60;

    updateTimer();
}

updateTimer();

// ======================
// NOTES
// ======================

function saveNote(){

    let text = document.getElementById("noteInput").value.trim();

    if(!text) return;

    notes.push(text);

    localStorage.setItem("notes",JSON.stringify(notes));

    document.getElementById("noteInput").value="";

    renderNotes();
}

function renderNotes(){

    let container = document.getElementById("notesContainer");

    container.innerHTML="";

    notes.forEach(n=>{

        container.innerHTML += `
        <div class="note">
            ${n}
        </div>
        `;
    });
}

// ======================
// ANALYTICS
// ======================

let chart;

function updateChart(){

    let subjects = {};

    tasks.forEach(t=>{

        if(!subjects[t.subject]){
            subjects[t.subject]=0;
        }

        if(t.done){
            subjects[t.subject]++;
        }
    });

    let labels = Object.keys(subjects);

    let data = Object.values(subjects);

    if(chart){
        chart.destroy();
    }

    let ctx = document.getElementById("studyChart");

    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels:labels,
            datasets:[{
                label:"Completed Tasks",
                data:data
            }]
        }
    });
}

// ======================
// WEAK SUBJECT
// ======================

function detectWeakSubject(){

    let counts={};

    tasks.forEach(t=>{

        if(!counts[t.subject]){
            counts[t.subject]=0;
        }

        if(t.done){
            counts[t.subject]++;
        }
    });

    let weak="";

    let min=Infinity;

    for(let sub in counts){

        if(counts[sub]<min){

            min=counts[sub];

            weak=sub;
        }
    }

    if(weak){
        document.getElementById("weakSubject").innerText =
        `⚠ You are weak in ${weak}`;
    }
}

// ======================
// INIT
// ======================

renderTasks();
renderNotes();
updateDashboard();
updateChart();
detectWeakSubject();
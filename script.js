// =======================
// DATA
// =======================

let subjects =
JSON.parse(localStorage.getItem("subjects")) || [];

let currentSubject = null;

let chart;

// =======================
// SAVE
// =======================

function saveData(){

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );
}

// =======================
// ADD SUBJECT
// =======================

function addSubject(){

    let input =
    document.getElementById("subjectInput");

    let name = input.value.trim();

    if(!name) return;

    subjects.push({

        name:name,

        tasks:[],

        notes:[],

        streak:0,

        sessions:0
    });

    input.value="";

    saveData();

    renderSubjects();
}

// =======================
// DELETE SUBJECT
// =======================

function deleteSubject(index){

    let confirmDelete =
    confirm("Delete this subject?");

    if(confirmDelete){

        subjects.splice(index,1);

        saveData();

        renderSubjects();
    }
}

// =======================
// RENDER SUBJECTS
// =======================

function renderSubjects(){

    let container =
    document.getElementById("subjectsContainer");

    container.innerHTML="";

    subjects.forEach((sub,index)=>{

        let completed =
        sub.tasks.filter(t=>t.done).length;

        container.innerHTML += `

        <div class="subjectCard">

            <div
                class="subjectInfo"
                onclick="openDashboard(${index})"
            >

                <h2>📘 ${sub.name}</h2>

                <p>
                    📋 Total Tasks:
                    ${sub.tasks.length}
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

    document.getElementById(
        "homeScreen"
    ).style.display="none";

    document.getElementById(
        "dashboardScreen"
    ).style.display="block";

    document.getElementById(
        "subjectTitle"
    ).innerText =
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

    document.getElementById(
        "dashboardScreen"
    ).style.display="none";

    document.getElementById(
        "homeScreen"
    ).style.display="block";

    renderSubjects();
}

// =======================
// TASKS
// =======================

function addTask(){

    let input =
    document.getElementById("taskInput");

    let text = input.value.trim();

    if(!text) return;

    currentSubject.tasks.push({

        text:text,

        done:false
    });

    input.value="";

    saveData();

    renderTasks();

    updateStats();

    updateChart();
}

function toggleTask(i){

    currentSubject.tasks[i].done =
    !currentSubject.tasks[i].done;

    if(currentSubject.tasks[i].done){
        confetti();
    }

    saveData();

    renderTasks();

    updateStats();

    updateChart();
}

function deleteTask(i){

    currentSubject.tasks.splice(i,1);

    saveData();

    renderTasks();

    updateStats();

    updateChart();
}

function renderTasks(){

    let container =
    document.getElementById("taskList");

    container.innerHTML="";

    currentSubject.tasks.forEach((task,i)=>{

        container.innerHTML += `

        <div class="task">

            <h3>${task.text}</h3>

            <button onclick="toggleTask(${i})">

                ${task.done ? "Undo":"Done"}

            </button>

            <button onclick="deleteTask(${i})">

                Delete

            </button>

        </div>
        `;
    });
}

// =======================
// NOTES
// =======================

function saveNote(){

    let input =
    document.getElementById("noteInput");

    let text = input.value.trim();

    if(!text) return;

    currentSubject.notes.push(text);

    input.value="";

    saveData();

    renderNotes();
}

function renderNotes(){

    let container =
    document.getElementById("notesContainer");

    container.innerHTML="";

    currentSubject.notes.forEach(note=>{

        container.innerHTML += `
        <div class="note">

            ${note}

        </div>
        `;
    });
}

// =======================
// STATS
// =======================

function updateStats(){

    let completed =
    currentSubject.tasks.filter(
        t=>t.done
    ).length;

    document.getElementById(
        "taskCount"
    ).innerText = completed;

    document.getElementById(
        "sessionCount"
    ).innerText =
    currentSubject.sessions;

    document.getElementById(
        "streakCount"
    ).innerText =
    currentSubject.streak;
}

// =======================
// TIMER
// =======================

let totalSeconds = 25 * 60;

let timer;

let running = false;

function updateTimer(){

    let min =
    Math.floor(totalSeconds/60);

    let sec =
    totalSeconds%60;

    document.getElementById(
        "timer"
    ).innerText =

    `${String(min).padStart(2,"0")}
    :
    ${String(sec).padStart(2,"0")}`;
}

function startTimer(){

    if(running) return;

    running = true;

    timer = setInterval(()=>{

        totalSeconds--;

        updateTimer();

        if(totalSeconds<=0){

            clearInterval(timer);

            running=false;

            currentSubject.sessions++;

            currentSubject.streak++;

            saveData();

            confetti();

            alert(
                "Study Session Completed!"
            );

            totalSeconds = 25*60;

            updateTimer();

            updateStats();
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

// =======================
// CHART
// =======================

function updateChart(){

    let completed =
    currentSubject.tasks.filter(
        t=>t.done
    ).length;

    let pending =
    currentSubject.tasks.length
    - completed;

    if(chart){
        chart.destroy();
    }

    let ctx =
    document.getElementById("chart");

    chart = new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[
                "Completed",
                "Pending"
            ],

            datasets:[{

                data:[
                    completed,
                    pending
                ]

            }]
        }
    });
}

// =======================
// INIT
// =======================

renderSubjects();
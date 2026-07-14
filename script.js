// =====================================
// DATA
// =====================================

let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

subjects.forEach(subject => {

    if (!subject.mainTasks) subject.mainTasks = [];
    if (!subject.notes) subject.notes = [];
    if (!subject.sessions) subject.sessions = 0;
    if (!subject.streak) subject.streak = 0;

});

let currentSubject = null;
let currentMainTask = null;
let chart = null;


// =====================================
// SAVE
// =====================================

function saveData(){

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

}


// =====================================
// SUBJECTS
// =====================================

function addSubject(){

    let input =
        document.getElementById("subjectInput");

    let name = input.value.trim();

    if(name==""){
        alert("Enter Subject Name");
        return;
    }

    subjects.push({

        name:name,

        mainTasks:[],

        notes:[],

        sessions:0,

        streak:0

    });

    input.value="";

    saveData();

    renderSubjects();

}



function deleteSubject(index){

    if(confirm("Delete Subject?")){

        subjects.splice(index,1);

        saveData();

        renderSubjects();

    }

}



// =====================================
// HOME SCREEN
// =====================================

function renderSubjects(){

    let container =
        document.getElementById("subjectsContainer");

    container.innerHTML="";

    subjects.forEach((subject,index)=>{

        let completed=0;
        let total=0;

        subject.mainTasks.forEach(main=>{

            total+=main.subTasks.length;

            completed+=
                main.subTasks.filter(
                    t=>t.done
                ).length;

        });

        container.innerHTML+=`

        <div class="subjectCard">

            <div
            class="subjectInfo"
            onclick="openMainTasks(${index})">

            <h2>📘 ${subject.name}</h2>

            <p>
            📂 Main Tasks :
            ${subject.mainTasks.length}
            </p>

            <p>
            ✅ Progress :
            ${completed}/${total}
            </p>

            </div>

            <button
            onclick="deleteSubject(${index})">
            Delete
            </button>

        </div>

        `;

    });

}



// =====================================
// OPEN SUBJECT
// =====================================

function openMainTasks(index){

    currentSubject=subjects[index];

    document.getElementById(
        "homeScreen"
    ).style.display="none";

    document.getElementById(
        "mainTaskScreen"
    ).style.display="block";

    document.getElementById(
        "mainTaskTitle"
    ).innerHTML=
    "📘 "+currentSubject.name;

    renderMainTasks();

    renderNotes();

    updateStats();

    updateChart();

}



// =====================================
// GO HOME
// =====================================

function goHome(){

    currentSubject=null;

    document.getElementById(
        "mainTaskScreen"
    ).style.display="none";

    document.getElementById(
        "homeScreen"
    ).style.display="block";

    renderSubjects();

}

// =====================================
// MAIN TASKS
// =====================================

function addMainTask(){

    let input =
        document.getElementById("mainTaskInput");

    let name = input.value.trim();

    if(name=="") return;

    currentSubject.mainTasks.push({

        name:name,

        subTasks:[]

    });

    input.value="";

    saveData();

    renderMainTasks();

    renderSubjects();

}



function deleteMainTask(index){

    if(confirm("Delete Main Task?")){

        currentSubject.mainTasks.splice(index,1);

        saveData();

        renderMainTasks();

        renderSubjects();

    }

}



function renderMainTasks(){

    let container=
        document.getElementById("mainTaskList");

    container.innerHTML="";

    currentSubject.mainTasks.forEach((task,index)=>{

        let completed=
            task.subTasks.filter(
                t=>t.done
            ).length;

        container.innerHTML+=`

        <div class="mainTaskCard">

            <div
            class="mainTaskInfo"
            onclick="openSubTasks(${index})">

            <h2>📂 ${task.name}</h2>

            <p>
            Progress :
            ${completed}/${task.subTasks.length}
            </p>

            </div>

            <button
            onclick="deleteMainTask(${index})">

            Delete

            </button>

        </div>

        `;

    });

}



// =====================================
// OPEN SUBTASK SCREEN
// =====================================

function openSubTasks(index){

    currentMainTask=
        currentSubject.mainTasks[index];

    document.getElementById(
        "mainTaskScreen"
    ).style.display="none";

    document.getElementById(
        "subTaskScreen"
    ).style.display="block";

    document.getElementById(
        "subTaskTitle"
    ).innerHTML=
    "📂 "+currentMainTask.name;

    renderSubTasks();

}



function backToMainTasks(){

    document.getElementById(
        "subTaskScreen"
    ).style.display="none";

    document.getElementById(
        "mainTaskScreen"
    ).style.display="block";

    renderMainTasks();

    updateStats();

    updateChart();

}



// =====================================
// SUBTASKS
// =====================================

function addSubTask(){

    let input=
        document.getElementById("subTaskInput");

    let text=input.value.trim();

    if(text=="") return;

    currentMainTask.subTasks.push({

        text:text,

        done:false

    });

    input.value="";

    saveData();

    renderSubTasks();

    renderMainTasks();

    renderSubjects();

}



function toggleSubTask(index){

    let task=
        currentMainTask.subTasks[index];

    task.done=!task.done;

    if(task.done){

        confetti();

    }

    saveData();

    renderSubTasks();

    renderMainTasks();

    renderSubjects();

}



function deleteSubTask(index){

    currentMainTask.subTasks.splice(index,1);

    saveData();

    renderSubTasks();

    renderMainTasks();

    renderSubjects();

}



function renderSubTasks(){

    let container=
        document.getElementById("subTaskList");

    container.innerHTML="";

    currentMainTask.subTasks.forEach((task,index)=>{

        container.innerHTML+=`

        <div class="subTask">

            <span
            class="${
                task.done
                ?"completed"
                :""
            }">

            ${task.text}

            </span>

            <div>

            <button
            onclick="toggleSubTask(${index})">

            ${
                task.done
                ?"Undo"
                :"Done"
            }

            </button>

            <button
            onclick="deleteSubTask(${index})">

            Delete

            </button>

            </div>

        </div>

        `;

    });

}


// =====================================
// NOTES
// =====================================

function saveNote(){

    let input=document.getElementById("noteInput");

    let text=input.value.trim();

    if(text=="") return;

    currentSubject.notes.push(text);

    input.value="";

    saveData();

    renderNotes();

}

function renderNotes(){

    let container=document.getElementById("notesContainer");

    container.innerHTML="";

    currentSubject.notes.forEach(note=>{

        container.innerHTML+=`
        <div class="note">

        ${note}

        </div>
        `;

    });

}



// =====================================
// STATISTICS
// =====================================

function updateStats(){

    let total=0;
    let completed=0;

    currentSubject.mainTasks.forEach(main=>{

        total+=main.subTasks.length;

        completed+=main.subTasks.filter(
            t=>t.done
        ).length;

    });

    document.getElementById("taskCount").innerHTML=completed;

    document.getElementById("sessionCount").innerHTML=
    currentSubject.sessions;

    document.getElementById("streakCount").innerHTML=
    currentSubject.streak;

}



// =====================================
// TIMER
// =====================================

let totalSeconds=25*60;

let timer;

let running=false;

function updateTimer(){

    let min=Math.floor(totalSeconds/60);

    let sec=totalSeconds%60;

    document.getElementById("timer").innerHTML=

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

            currentSubject.sessions++;

            currentSubject.streak++;

            saveData();

            confetti();

            alert("Study Session Completed!");

            updateStats();

            totalSeconds=25*60;

            updateTimer();

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



// =====================================
// CHART
// =====================================

function updateChart(){

    let completed=0;

    let pending=0;

    currentSubject.mainTasks.forEach(main=>{

        completed+=main.subTasks.filter(
            t=>t.done
        ).length;

        pending+=main.subTasks.filter(
            t=>!t.done
        ).length;

    });

    if(chart) chart.destroy();

    chart=new Chart(

        document.getElementById("chart"),

        {

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

        }

    );

}



// =====================================
// INITIALIZE
// =====================================

renderSubjects();

updateTimer();





// =======================
// SEARCH SUBJECTS
// =======================

function searchSubjects(){

    let keyword = document
        .getElementById("subjectSearch")
        .value
        .toLowerCase();

    let cards =
        document.querySelectorAll(".subjectCard");

    cards.forEach(card=>{

        let name =
            card.querySelector("h2")
            .innerText
            .toLowerCase();

        if(name.includes(keyword)){

            card.style.display="block";

        }
        else{

            card.style.display="none";

        }

    });

}





// =======================
// SEARCH TASKS
// =======================

function searchTasks(){

    let keyword =
        document.getElementById("taskSearch")
        .value
        .toLowerCase();

    let tasks =
        document.querySelectorAll(".task");

    tasks.forEach(task=>{

        let text =
            task.querySelector("h3")
            .innerText
            .toLowerCase();

        if(text.includes(keyword)){

            task.style.display="block";

        }
        else{

            task.style.display="none";

        }

    });

}




// =======================
// SEARCH NOTES
// =======================

function searchNotes(){

    let keyword =
        document.getElementById("noteSearch")
        .value
        .toLowerCase();

    let notes =
        document.querySelectorAll(".note");

    notes.forEach(note=>{

        let text =
            note.innerText
            .toLowerCase();

        if(text.includes(keyword)){

            note.style.display="block";

        }
        else{

            note.style.display="none";

        }

    });

}
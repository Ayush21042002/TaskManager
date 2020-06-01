document.onload = getDate();
document.onload = getTasks();

let universal;

//for displaying tomorrows date in due date
async function getDate(){
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()

    if (month < 10)
        month = '0' + month;

    const val = year+ '-' + month + '-' + day;

    document.getElementById('due-date').value = val;
}

async function getTasks() {

    const resp = await fetch('/tasks', { method: 'GET' })
    let tasks = await resp.json();
    universal = tasks;
    document.querySelector("#task-list").innerHTML = "";
    if (tasks.length == 0) {
        let accordion = document.getElementById("task-list");
        let div = document.createElement("div");
        accordion.appendChild(div);
        div.append("Task List is Empty. Nothing to dipslay.")

    } else {
        tasks= sortTasks(tasks)
        for (let task of tasks) {
            createTaskCard(task);
        }
    }
}

function createTaskCard(task) {
    let accordion = document.getElementById("task-list");
    let card = document.createElement("div");


    card.className = "card";
    card.id = `${task.id}`;

    var child1 = document.createElement("div");
    child1.className = "card-header";
    child1.id = "card-header";
    var button = document.createElement("button");
    button.id = "taskButton";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", `#note${task.id}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `note${task.id}`);
    button.className = "card-link";
    button.type = "button";
    child1.appendChild(button);
    card.appendChild(child1);


    let child2 = document.createElement("div");
    child2.className = "collapse";
    child2.id = `note${task.id}`;
    var cardBody = document.createElement("div");
    cardBody.id = `${task.id}`;
    cardBody.className = "card-body";
    var ul = document.createElement("ul");
    ul.className = "notes";
    ul.id = `list${task.id}`;
    cardBody.appendChild(ul);
    var textarea = document.createElement("textarea");
    textarea.setAttribute("rows", "1");
    textarea.setAttribute("cols", "30");
    textarea.className = "textarea";
    textarea.id = `addNote-textbox${task.id}`;
    textarea.placeholder = "Add Note";
    cardBody.appendChild(textarea);
    var addbtn = document.createElement("input");
    addbtn.type = "button";
    addbtn.value = "Add";
    addbtn.id = "addNote";
    addbtn.className = "addNote";
    addbtn.setAttribute("onclick", `addNoteToTask(${task.id})`);
    cardBody.appendChild(addbtn);

    child2.appendChild(cardBody);
    card.appendChild(child2);


    let child3 = document.createElement("input");
    child3.id = "updateButton";
    child3.value = "Click to Change";
    child3.type = "button";
    child3.setAttribute("onclick", `setUpUpdateModal(${task.id})`);
    child3.setAttribute("data-toggle", "modal");
    child3.setAttribute("data-target", "#updateModal");
    card.appendChild(child3);

    
    //button text
    var taskTitle = document.createElement("b");
    taskTitle.className = "title-tag";
    taskTitle.innerHTML = `${task.title}`;
    var hr = document.createElement("hr");
    button.appendChild(taskTitle);
    button.appendChild(hr);
    var desc = document.createElement("textContent");
    desc.innerText = `Description ==> ${task.description}`;
    var br1 = document.createElement("br");
    var br2 = document.createElement("br");
    var br3 = document.createElement("br");


    var due = document.createElement("textContent");
    due.innerText = `Due Date ==> ${task.due}`;
    var status1 = document.createElement("textContent");
    status1.innerText = `Status(completed) ==> ${task.status}`;
    var priority = document.createElement("textContent");
    priority.innerText = `Priority ==> ${task.priority}`;

    button.appendChild(desc);
    button.appendChild(br1);
    button.appendChild(due);
    button.appendChild(br2);
    button.appendChild(status1);
    button.appendChild(br3);
    button.appendChild(priority);
    accordion.appendChild(card);


    for (let note of task.Notes) {
        var li = document.createElement("li");
        li.append(`${note.content}`);

        document.getElementById(`list${task.id}`).appendChild(li);
    }
}

document.getElementById('add').onclick = async function addTask() {
    event.preventDefault();
    let title, description, priority, due, status = false;
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;
    due = document.getElementById("due-date").value;
    priority = document.getElementById('priority').value;
    const resp = await fetch('/addTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, status, due, priority })
    })
    if (resp.status == 200) {
        getTasks();
        document.getElementById("title").value = '';
        document.getElementById("description").value = '';
        getDate();
    }

}

async function addNoteToTask(id){
    let content = document.getElementById(`addNote-textbox${id}`).value;
    const resp = await fetch(`/${id}/addNote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
    if (resp.status == 200) {
        getTasks();
    }
}

async function setUpUpdateModal(id){
    const resp = await fetch(`/${id}/task`, { method: 'GET' })
    const tasks = await resp.json();

    document.getElementById('save').setAttribute("onclick", `updateModal(${tasks.id})`);
    document.getElementById('title-modal').value = tasks.title;
    document.getElementById('description-modal').value = tasks.description;
    document.getElementById('due-date-modal').value = tasks.due;
    document.getElementById('priority-modal').value = tasks.priority;
    if(tasks.status == true){
        document.getElementsByName('Status')[0].selected = true;
        }
}

async function updateModal(id){
    event.preventDefault();
    let title, description, priority, due, status = false;
    title = document.getElementById("title-modal").value;
    description = document.getElementById("description-modal").value;
    due = document.getElementById("due-date-modal").value;
    priority = document.getElementById('priority-modal').value;
    status = document.getElementById('status-modal').value;
    const resp = await fetch('/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id,title, description, status, due, priority })
    })
    if (resp.status == 200) {
        getTasks();
        getDate();
    }
    else{
        console.log("error")
    }

}

function sortTasks(tasks){
    const value = document.getElementById('sort-by').value;

    if (value == 'none')
    {
        return tasks;
    }

    if (value == "due-date-ascending" )
    {
        tasks.sort((a,b) =>{
            let x = new Date(a.due)
            let y = new Date(b.due)
            let ans;
            if (x < y) {
                ans = -1;
            }
            else if (x > y) {
                ans = 1;
            }
            else {
                ans = 0;
            }
            return ans;
        })
    }
    else if (value == "due-date-desceding")
    {
        tasks.sort((a, b) => {
            let x = new Date(a.due)
            let y = new Date(b.due)
            let ans;
            if(x < y)
            {
                ans=1;
            }
            else if(x > y){
                ans=-1;
            }
            else{
                ans=0;
            }
            return ans;
        })
    }
    else if (value == "priority-high")
    {
        tasks.sort((a, b) => {
            let x = a.priority
            let y = b.priority
            if (x == 'High') {
                x = 2;
            }
            else if (x == 'Medium') {
                x = 1;
            }
            else {
                x = 0;
            }

            if (y == 'High') {
                y = 2;
            }
            else if (y == 'Medium') {
                y = 1;
            }
            else {
                y = 0;
            }
            return y - x;
        })
    }
    else
    {
        tasks.sort((a,b) =>{
            let x= a.status;
            let y= b.status;

            if(x== false)
                x=1;
            else    
                x=0;

            if (y == false)
                y = 1;
            else
                y = 0;

            return y-x;

        })
    }

    return tasks;
}

document.getElementById('submit-sort').onclick = async function submitSort(event){
    event.preventDefault();
    document.querySelector("#task-list").innerHTML = "";
    universal = sortTasks(universal)
    for (let task of universal) {
        createTaskCard(task);
    }
}
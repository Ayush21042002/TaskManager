const express = require('express')

const {db,Tasks,Notes} = require('./db')

const app = express()

// this is helpful if the app is hosted
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

// checked if the database is successfully synced or not

db.sync().then(() => {
    app.listen(port)
})
    .catch((err) => {
        console.error(err)
    })

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// declaring the static folder
app.use('/', express.static(__dirname + '/front-end'))

//gets all the task
app.get('/tasks',async(req,res) =>{
    // we extract all the notes including their Notes 
    const tasks = await Tasks.findAll({include: Notes})         

    //error handling
    if(tasks===null)
        return res.status(400).send("error");

    res.send(tasks)
})

// adds a task to the database

app.post('/addTask',async(req,res) =>{
    //checked if title is not a string or is empty
    if (typeof req.body.title !== 'string' || req.body.title =='') {
        return res.status(400).send({ error: 'Task name must be provided' })
    }

    // created a new task with the input the user has entered
    const newTask = await Tasks.create({
        title: req.body.title,
        description: req.body.description,
        due: req.body.due,
        priority: req.body.priority,
        status: false
    })

    res.status(200).send("added note");
})

// adds a note to the respective task

app.post('/:id/addNote', async (req, res) => {
    //checked if title is not a string or is empty
    if (typeof req.body.content !== 'string' || req.body.content == '') {
        return res.status(400).send({ error: 'Note must be provided' })
    }

    // created a new note to the respective Task
    const newTask = await Notes.create({
        TaskId: Number(req.params.id),
        content: req.body.content
    })

    res.status(200).send("added note");
})

// updates the task with the respective id

app.put('/update',async(req,res) =>{

    // updates the content of given task
    Tasks.update({   
            title: req.body.title,
            description: req.body.description,
            due: req.body.due,
            priority: req.body.priority,
            status: req.body.status
        },
        { where: { id: Number(req.body.id) } }
    ).error(err =>{

            handleError(err)
            res.status(400);
        })
    
    return res.status(200).send('succesfully updated');
})

//for getting a respective task with given id

app.get('/:id/task', async (req, res) => {
    const tasks = await Tasks.findByPk(Number(req.params.id))

    if (tasks === null)
        console.log("error")

    res.send(tasks)
})
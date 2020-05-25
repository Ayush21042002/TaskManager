const express = require('express')

const {db,Tasks,Notes} = require('./db')

const app = express()

db.sync().then(() => {
    app.listen(3000)
})
    .catch((err) => {
        console.error(err)
    })


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static(__dirname + '/front-end'))

//gets all the task

app.get('/tasks',async(req,res) =>{
    const tasks = await Tasks.findAll({include: Notes})

    if(tasks===null)
        return res.status(400).send("error");

    res.send(tasks)
})
// adds a task to the database

app.post('/addTask',async(req,res) =>{
    if (typeof req.body.title !== 'string' || req.body.title =='') {
        return res.status(400).send({ error: 'Task name must be provided' })
    }

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
    if (typeof req.body.content !== 'string' || req.body.content == '') {
        return res.status(400).send({ error: 'Note must be provided' })
    }

    const newTask = await Notes.create({
        TaskId: Number(req.params.id),
        content: req.body.content
    })

    res.status(200).send("added note");
})

// updates the task with the respective id

app.put('/update',async(req,res) =>{
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

app.get('/:id/task', async (req, res) => {
    const tasks = await Tasks.findByPk(Number(req.params.id))

    if (tasks === null)
        console.log("error")

    res.send(tasks)
})
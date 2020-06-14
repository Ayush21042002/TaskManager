const Sequelize = require('sequelize')

//declaring a database
const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test.db',
})

// declaring and defining the structure of tasks model

const Tasks = db.define('Tasks', {
    title: {                                    //for title of task
        type: Sequelize.STRING(100),        
        allowNull: false,
    },
    description: {                              // for the description of tasks
        type: Sequelize.STRING(200),
        allowNull: true
    },
    due: {                                      // stores the due date 
        type: Sequelize.DATEONLY
    },
    priority: {                                 // stores the priority as high, medium or low
        type: Sequelize.STRING(30),
        allowNull: false
    },
    status: {                                   // stores status as boolean  
        type: Sequelize.BOOLEAN,                // incomplete as false 
        defaultValue: false                     // completed as true
    }
})

//declaring and defining the structure of Notes model

const Notes = db.define('Notes', {
    task_id: {                                  // stores the task_id 
        type: Sequelize.INTEGER,                // in case two tasks have same note
        primaryKey: true,
        autoIncrement: true
    },
    content: {                                  // stores the value of the description of the note
        type: Sequelize.STRING(100),
        allowNull: false,
    }
})

// these two statements help link the two models 
// every task can have any number of notes
Tasks.hasMany(Notes)
// every note belongs to one task
Notes.belongsTo(Tasks)

// exporting the database and models
module.exports = {
    db, Tasks,Notes
}
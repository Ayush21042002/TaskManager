const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test.db',
})

const Tasks = db.define('Tasks', {
    title: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(200),
        allowNull: true
    },
    due: {
        type: Sequelize.DATEONLY
    },
    priority: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

const Notes = db.define('Notes', {
    task_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: Sequelize.STRING(100),
        allowNull: false,
    }
})

Tasks.hasMany(Notes)
Notes.belongsTo(Tasks)

module.exports = {
    db, Tasks,Notes
}
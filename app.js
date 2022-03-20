
const chalk = require("chalk");
const mongoose = require('mongoose');
const program = require('commander');

// Connecting to database
const dbUrl = 'mongodb+srv://noteAdmin:NBZ6XwWTibJDrzX@notesdb.c2r6c.mongodb.net/TaskerDb?retryWrites=true&w=majority';

mongoose.connect(dbUrl)
	.then(console.log('connected to DB'))
	.catch((err) => {console.log(err)})

////////////////////////////////////////
//     Defining a Schema and Model    //
////////////////////////////////////////
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean
    }
});

const Task = mongoose.model('Task', taskSchema);


/////////////////////////////////////////////////
//      ADDING THE FUNCTIONS FOR COMMANDS     //
////////////////////////////////////////////////

// Add-task
const addTask = (task) => {
	Task.create(task).then(task => {
		console.info('New Task Added');
	})
	.then(()=>{mongoose.connection.close()})	
}

// Show incomplete tasks
const listTasks = () => {

	Task.find({completed: false})
		.then(task => {
			task.forEach(element => {
				console.info(chalk.bold.red('----------------------'))
				console.info(chalk.bold.blue('Id: '),chalk.bold.yellow(element._id))
				console.info(chalk.bold.blue('Title: '), element.title)
				console.info(chalk.bold.blue('Description: '),element.desc)
				if (element.completed===false) {
					console.info(chalk.bold.blue('Status:') ,'Pending')
				} else {
					console.info(chalk.bold.blue('Status:') ,'Done')	
				}
			});
		})
		.catch((err) => {console.info(err)})
		.then(()=>{mongoose.connection.close()})
}

// Update a task status
const updateTask = (_id) => {
	Task.findByIdAndUpdate(_id, {completed: true})
		.then(console.info('Task marked as Completed'))
		.catch((err) => {console.info(err)})
		.then(()=>{mongoose.connection.close()})
}

// Delete a Task
const deleteTask = (_id) => {
	Task.findByIdAndDelete(_id)
		.then(console.info('Task Deleted'))
		.catch((err) => {console.info(err)})
		.then(()=>{mongoose.connection.close()})
}




////////////////////////////////////////
//        DECLEARING COMMANDS         //
////////////////////////////////////////

program
    .version('1.0.0')
    .description('Task Management System')

// Add Task
program
    .command('add <title> <desc> <completed>')
    .alias('a')
    .description('Add a task')
    .action((title, desc, completed) => {
        addTask({title, desc, completed});
    });

// List Tasks
program
    .command('list')
    .alias('l')
    .description('list incomplete tasks')
    .action(() => {
        listTasks();
    });

// Update Tasks
program
    .command('update <id>')
    .alias('u')
    .description('Update a task as Completed')
    .action((id) => {
        updateTask(id);
    });

//Delete Tasks
program
    .command('delete <id>')
    .alias('d')
    .description('Delete a Task')
    .action((id) => {
        deleteTask(id);
    })


program.parse(process.argv);






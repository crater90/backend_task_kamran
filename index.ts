import 'dotenv/config'

import express from 'express'
import path from 'path';

const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Redis = require('redis');
const client = Redis.createClient();

// connecting to database MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('database connected');
    })
    .catch((error: Error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
    });

//creating a schema for todos
const todoSchema = new mongoose.Schema({
    todos: [String]
});

const TodoModel = mongoose.model('BACKEND_TASK_KAMRAN', todoSchema);

// to save todos in database after 50 entries
async function addToMongoDB() {
    try {
        const arr = await client.lRange('BACKEND_TASK_KAMRAN', 0, -1);
        console.log(arr);
        const doc = new TodoModel({
            todos: arr
        });
        const saved = await doc.save();
        console.log('savedtoDB');
        const result = await client.flushAll();
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

// connecting to redis server
client.connect()
    .then(() => {
        console.log('Redis connected');
    })
    .catch((err : Error) => console.log(err));


http.listen(5000, () => {
    console.log('server started at port 5000');
})


io.on('connection', (socket: any) => {

    socket.on('add', async (todo: string) => {
        client.rPush('BACKEND_TASK_KAMRAN', todo);
        try {
            const length = await client.lLen('BACKEND_TASK_KAMRAN');
            if (length === 50) {
                await addToMongoDB();
            }
        } catch (error) {
            console.log('failed while getting length of cache or saving to DB');
            console.error(error)
        }
    })

    socket.on('disconnect', () => {
    })
})

//serving the index.html file for adding todos
app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
})

//getting all tasks
app.get('/fetchAllTasks', async(req: express.Request, res: express.Response) => {
    let allTasks = [];
    try {
        const tasksFromDB = await TodoModel.find();
        for(let task of tasksFromDB) {
            allTasks.push(...task.todos);
        }
        const arr = await client.lRange('BACKEND_TASK_KAMRAN', 0, -1);
        allTasks.push(...arr);
        console.log(allTasks);
        res.json({allTasks});       
    } catch (error) {
        res.status(500).json(error);
    }
})

//dotenv
require("dotenv").config();

// import modules
const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');

//my stuff
const User = require('./models/User'); // import the User model
const ToDos = require('./models/ToDos'); // import the ToDos model
const sendWelcomeEmail = require('./sendWelcomeEmail');

//openAI
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// express
const app = express();
app.use(express.json());

// Mongodb
mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log('DB CONNECTED')).catch(err => console.log("DB CONNECTION ERROR", err));

// middleware -- didn't really end up using these
app.use(morgan("dev"));
app.use(cors({
    origin: 'http://localhost:3000', // Allow the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow cookies to be sent with requests (if needed)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form submissions


// test route
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the backend! BIG KAHUNA" });
});

//POST /todos - Add a new ToDo item
app.post('/api/todos', async (req, res) => { 
    try {
        const { userId, title, description } = req.body;
        console.log("IN app.js, RIGHT AFTER WE CALL THE POST/API/TODOS. userID, title, description");
        console.log(userId, title, description);

        //req fields
        if (!userId || !title) {
            return res.status(400).json({ error: 'User ID and title are required.' });
        }

        //check user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        //create the new to-do item
        const newToDo = new ToDos({
            userId: userId,
            title,
            description,
            completed: false,
        });

        // sace to mongodb
        const savedToDo = await newToDo.save();
        res.status(201).json(savedToDo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// GET /todos/:userId - fetch all to-dos for a specific user
app.get('/api/todos/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Received userId:', userId); // test log userId

        // find all todos for the user
        const todos = await ToDos.find({ userId: new mongoose.Types.ObjectId(userId) });
        console.log('Fetched To-Dos:', todos); // test log fetched todos

        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// PUT /api/todos/:id - Update a specific To-Do
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body; // extract updated fields from the request body

        const updatedToDo = await ToDos.findByIdAndUpdate(
            id, 
            { title, description }, 
            { new: true } //return the updated document
        );

        // If the to-do does not exist
        if (!updatedToDo) {
            return res.status(404).json({ error: 'To-Do not found.' });
        }

        res.status(200).json(updatedToDo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

//DELETE Todos
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        await ToDos.deleteOne({ _id: todoId });
        res.status(200).send({ message: 'To-do deleted successfully' });
    } catch (error) {
        console.error('Error deleting to-do:', error);
        res.status(500).send({ error: 'Error deleting to-do' });
    }
});

//TOGGLE completion
app.patch('/api/todos/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const { completed } = req.body;

        const updatedToDo = await ToDos.findByIdAndUpdate(
            todoId,
            { completed },
            { new: true }
        );

        res.status(200).send(updatedToDo);
    } catch (error) {
        console.error('Error updating completion status:', error);
        res.status(500).send({ error: 'Error updating completion status' });
    }
});


//AI GENERATED TODOS
app.post('/api/generate-todos', async (req, res) => {
    const { text, userId} = req.body;

    const prompt = `Convert the following text into a list of actionable to-do items. Please limit the number of suggested items from 2-5. Do not enumerate these suggestions. Message: ${text}`;
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            max_tokens: 200,
        });
        console.log("OPENAI API Response: ", response);

        const generatedTasks = response.choices[0].message.content.trim().split("\n");

        // save the tasks in your database as before
        const tasks = await Promise.all(
            generatedTasks.map(async (task) => {
                const newToDo = new ToDos({ userId, title: task, description: '', completed: false });
                return newToDo.save();
            })
        );

        res.status(201).json({ message: 'Tasks created successfully', tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating to-dos' });
    }
});


// User Registration
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        // create and save the new user
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
        await sendWelcomeEmail(email);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// user Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        // compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        // create JWT token
        const token = jwt.sign(
            { userId: user._id, name: user.name },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // return success response
        res.json({ message: "Login successful", token: token, user: { name: user.name, email: user.email, _id: user._id } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

//port
const port = process.env.PORT || 8080;

//listener 
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
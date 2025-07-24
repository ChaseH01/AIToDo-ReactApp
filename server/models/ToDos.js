const mongoose = require('mongoose');

// Define the schema for a to-do item
const ToDoSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //reference the User model
        required: true, //every to-do must belong to a user
    },
    title: {                       
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    completed: {
        type: Boolean,
        default: false, //default to incomplete
    },
}, { timestamps: true }); 

// Export the model to be used in other parts of the app
module.exports = mongoose.model('ToDo', ToDoSchema);

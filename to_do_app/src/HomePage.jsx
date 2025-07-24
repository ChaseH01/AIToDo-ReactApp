import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

import './App.css';

function HomePage({ storedUsername }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Calculate progress based on completed tasks
    const completedTasks = todos.filter(todo => todo.completed).length;
    const totalTasks = todos.length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

        // Fetch todos when the component is fiiirst calledd
        useEffect(() => {
            const fetchToDos = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const userId = localStorage.getItem('userId');
    
                    // fetch the user's todos from the backend wtih axios
                    const response = await axios.get(`/api/todos/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log('Fetched To-Dos:', response.data);
    
                    setTodos(response.data);
                } catch (error) {
                    console.error('Error fetching to-dos:', error);
                }
            };
    
            fetchToDos();
        }, []); // Empty dependency array ---- ensures only once 

    const handleAddToDo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');


            const response = await axios.post(
                '/api/todos',
                { userId, title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update UI with the todo
            setTodos([...todos, response.data]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error adding to-do:', error);
        }
    };

    const handleEditToDo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `/api/todos/${id}`,
                { title: editTitle, description: editDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            //update the to-do list in state with the updated to-do
            setTodos(
                todos.map((todo) =>
                    todo._id === id
                        ? { ...todo, title: response.data.title, description: response.data.description }
                        : todo
                )
            );
            setEditingId(null);
        } catch (error) {
            console.error('Error editing to-do:', error);
        }
    };

    const handleDeleteToDo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // update the state to remove the deleted to-do
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (error) {
            console.error('Error deleting to-do:', error);
        }
    };

    const handleToggleCompleted = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `/api/todos/${id}`,
                { completed: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTodos(
                todos.map((todo) =>
                    todo._id === id ? { ...todo, completed: response.data.completed } : todo
                )
            );
        } catch (error) {
            console.error('Error toggling completion status:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Your To-Do List', 20, 20);
        doc.setFontSize(12);
        
        let yOffset = 30; // starting position for the list
        todos.forEach((todo) => {
            doc.text(`${todo.title} - ${todo.description || 'No description'}`, 20, yOffset);
            yOffset += 10; // increase y-offset for next item
        });

        // Save the generated PDF with a filename
        doc.save('todos-list.pdf');
    };

    //AI INTEGRATION
    const [userInput, setUserInput] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post('/api/generate-todos', { text: userInput, userId: userId });
            setResponseMessage(response.data.message);

            const token = localStorage.getItem('token');
            
            const todosResponse = await axios.get(`/api/todos/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTodos(todosResponse.data);

        } catch (error) {
            setResponseMessage('todosResponse');
        }
    };

    return (
        <div>
            <h1 className='Name_Title'>Welcome, {storedUsername}!</h1>
              {/* Progress Bar */}
                <div style={{ marginTop: '20px' }}>
                <h3>Progress: {Math.round(progress)}%</h3>
                <div
                    style={{
                        width: '100%',
                        backgroundColor: '#f0f0f0',
                        height: '20px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            backgroundColor: '#4caf50',
                            height: '100%',
                            borderRadius: '10px',
                        }}
                    ></div>
                </div>
            </div>

            <h3>Add a To-Do: </h3>

            {/* Form to add a new to-do */}
            <form onSubmit={handleAddToDo}>
                <input className='ToDo_Title'
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea className='ToDo_Description'
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button className='Add_Button' type="submit">Add To-Do</button>
            </form>

            {/*AI INTEGRATION PART*/}
            <div>
                <h3>Harness the power of AI:</h3>
                <textarea className='AI_textarea'
                    value={userInput} 
                    onChange={(e) => setUserInput(e.target.value)} 
                    placeholder="Tell me your task..." 
                />
                <button className='Generate_Button' onClick={handleSubmit}>Generate To-Dos</button>
                <p>{responseMessage}</p>
            </div>

            {/* Display PART*/}
            <h3>Your ToDos: </h3>
             {/* Button to download PDF */}
            <button className='download_button' onClick={generatePDF}>Download To-Do List as PDF</button>
            <div className='ToDos_Container'>
                <ol>
                {todos.map((todo) => (
                        <li key={todo._id}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleCompleted(todo._id, todo.completed)}
                            />
                            {editingId === todo._id ? (
                                <>
                                    {/* Inline editing */}
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    ></textarea>
                                    <button onClick={() => handleEditToDo(todo._id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    {/* Display to-do */}
                                    <strong>{todo.title}</strong> - {todo.description || 'No description'}
                                    <button className='ToDo_Edit_Button'
                                        onClick={() => {
                                            setEditingId(todo._id);
                                            setEditTitle(todo.title);
                                            setEditDescription(todo.description || '');
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button className='ToDo_Delete_Button' onClick={() => handleDeleteToDo(todo._id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ol>        
            </div>
        </div>
    );
}

export default HomePage;

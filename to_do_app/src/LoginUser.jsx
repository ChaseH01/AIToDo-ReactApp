import React, { useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom'; --- didnt need this: Chase


const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/login', { email, password });
            console.log('Login response::::: ', res);

            localStorage.setItem('token', res.data.token); //store token in localStorage
            localStorage.setItem('username', res.data.user.name);  //save the user's name        
            localStorage.setItem('userId', res.data.user._id); //save the user's ID


            console.log('Token, username, userId saved to localStorage:', localStorage.getItem('token'), localStorage.getItem('username'), localStorage.getItem('userId'));

            setMessage(res.data.message);
            setIsAuthenticated(true);

        } catch (err) {
            setMessage(err.response.data.error || "Login failed");
        }
    }; 

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Login;

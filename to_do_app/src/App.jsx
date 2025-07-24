import React, { useState, useEffect } from 'react'; 
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './RegisterUser';
import Login from './LoginUser';
import HomePage from './HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loginChecked, setLoginChecked] = useState(false);  // track whether we've finished the login check
  


  // check if there's a token stored in localStorage to know if someone is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    console.log("STORED USERNAME!!!!::: ");
    console.log(storedUsername);

    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    } else {
      setIsAuthenticated(false);
      setUsername(''); 
    }
    setLoginChecked(true);

  }, [isAuthenticated]);

  if (!loginChecked) {
    return <div>Loading...</div>;
  }
  
  return (
    <Router> {/* Wrap the entire app inside the Router */}
      <div>
        {/* If authenticated, show HomePage and logout button */}
        {isAuthenticated ? (
          <AuthenticatedApp setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} username={username}  />
        ) : (
          <div className="LOGIN_SCREEN">
            {/* Show login and reegister form tgethr*/}
            <div>
              <h1> Welcome to your personalized AI Powered To-Do List!</h1>
            </div>
            <div className='Login_Reg'>
              <Login setIsAuthenticated={setIsAuthenticated}/>
            </div>
            <div className='Login_Reg'>
              <Register />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

function AuthenticatedApp({ setIsAuthenticated, setUsername, username}) {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storedUsername');
    setIsAuthenticated(false);
    setUsername('');

  };

  return (
    <div>
      <button className='Logout_Button' onClick={handleLogout}>Logout</button>
      <Routes>
        <Route path="/" element={<HomePage storedUsername={username}/>} />
      </Routes>
    </div>
  );
}

export default App;

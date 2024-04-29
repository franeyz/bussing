import './App.css'
import {useState, useEffect} from 'react';
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Schedules from './pages/Schedules';
import axios from 'axios';

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const fetchCurrentUser = async () => {
    // Get the authentication token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      // Use axios to send a GET request to the /current_user endpoint
      const response = await axios.get('/current_user', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
      });
      // Set the current user state with the response data
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  // Use useEffect to fetch current user data only when the token in local storage changes
  useEffect(() => {
    fetchCurrentUser();
  }, []); // Empty dependency array because you only want to fetch once on mount

  return (
    <>
      <div>
        {/*conditionally render logout button*/}
        {currentUser && <button onClick={handleLogout}>Logout</button>}
        {currentUser ? (
            <p id='currUser'>Logged in as: {currentUser.user.username}</p>
        ) : (
            <p>Not logged in</p>
        )}
      </div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/schedules' element={<Schedules />} />
      </Routes>
    </>
  )
}

export default App;

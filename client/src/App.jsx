import './App.css'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Schedules from './pages/Schedules';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_SERVER;
axios.defaults.withCredentials = true;

function App() {
  //console.log('axios.defaults.baseURL', import.meta.env.VITE_SERVER)
  return (
    <>
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

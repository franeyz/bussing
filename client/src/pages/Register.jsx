import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function Register() {
  // initialize empty state
  const [data, setData] = useState({
    username: '',
    password: '',
  })

  const registerUser = async (evt) => {
    evt.preventDefault()
    const {username, password} = data
    try {
      const res = await axios.post('/register', {
        username, password
      })
      console.log('Response:', res.data);
      navigate('/login');
    } catch (error) {
      console.log('problem with registerUser', error)
    }
  }
  return (
    <div>
      <form onSubmit={registerUser}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' placeholder='enter username' value={data.username} onChange={(evt) => setData({...data, username: evt.target.value})} required minlength="6" />
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' placeholder='enter password' value={data.password} onChange={(evt) => setData({...data, password: evt.target.value})} required minlength="6" />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

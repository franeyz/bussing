import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  // initialize empty state
  const [data, setData] = useState({
    username: '',
    password: '',
  })

  const loginUser = async (evt) => {
    evt.preventDefault()
    const {username, password} = data;
    try {
      const res = await axios.post('/login', {
        username, password
      });
      if (data.error) {
        console.log(data.error);
      }
      else {
        setData({});
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <form onSubmit={loginUser}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' placeholder='enter username' value={data.username} onChange={(evt) => setData({...data, username: evt.target.value})} />
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' placeholder='enter password' value={data.password} onChange={(evt) => setData({...data, password: evt.target.value})} />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

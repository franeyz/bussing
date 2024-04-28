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
  const [error, setError] = useState('');

  const loginUser = async (evt) => {
    evt.preventDefault()
    console.log('login jsx data',data);
    const {username, password} = data;
    try {
      const res = await axios.post('/login', {
        username, password
      });
      console.log('res',res);
      if (res.status === 200) {
        setData({});
        setError('');
        navigate('/');
      }
      else {
        setError("error occured");
      }
    } catch (e) {
      // Handle error response from the server
      if (e.response && e.response.data && e.response.data.error) {
        setError(e.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', e);
    }
  }
  return (
    <div>
      <form onSubmit={loginUser}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' placeholder='enter username' value={data.username} onChange={(evt) => setData({...data, username: evt.target.value})} required minlength="6"/>
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' placeholder='enter password' value={data.password} onChange={(evt) => setData({...data, password: evt.target.value})} required minlength="6"/>
        <button type='submit'>Login</button>
      </form>
      {/* Conditionally render the error message if it exists */}
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

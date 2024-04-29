import {useState} from 'react';
import axios from 'axios';

export default function Login() {
  // initialize empty state
  const [data, setData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('');

  const loginUser = async (evt) => {
    evt.preventDefault()
    console.log('login jsx data',data);
    // if user already logged in
    if (localStorage.getItem('token')) {
      setError('Please log out first');
    }
    else {
      const {username, password} = data;
      try {
        const res = await axios.post('/login', {
          username, password
        });
        console.log('res',res);
        if (res.status === 200) {
          setData({});
          setError('');
          console.log('res data token', res.data.token)
          localStorage.setItem('token', res.data.token);
          console.log(username, 'logged in')
          window.location.reload();
        }
        else {
          setError("error occured");
        }
      } catch (e) {
        // display error response from the server
        if (e.response && e.response.data && e.response.data.error) {
          setError(e.response.data.error);
        } else {
          console.log('Login error:', e);
          console.log('e.error:', e.error);
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Login error:', e);
      }
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
      {/* render the error message if it exists */}
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

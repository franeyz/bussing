import {useState} from 'react';
import axios from 'axios';

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
    } catch (error) {
      console.log('problem with registerUser', error)
    }
  }
  return (
    <div>
      <form onSubmit={registerUser}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' placeholder='enter username' value={data.username} onChange={(evt) => setData({...data, username: evt.target.value})} />
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' placeholder='enter password' value={data.password} onChange={(evt) => setData({...data, password: evt.target.value})} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

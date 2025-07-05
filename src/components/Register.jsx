import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      username,
      email,
      password
    };

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      //const result = await response.json();

      if (response.status === 409) {
        alert('User already exists');
      } else if (response.status === 201) {
        alert('Registered successfully');
        navigate('/');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
    <div className='register-container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className='register-form'>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br /><br />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit" className='btn'>Register</button>
        <p className='login-link'>Already have an account? <a href="/">Login</a></p>
      </form>
      </div>
    </>
  );
};

export default Register;

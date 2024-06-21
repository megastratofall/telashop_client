import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await axios.post('http://localhost:8000/api/login', formData);
      localStorage.setItem('token', response.data.token);
      onLogin();
      navigate('/products');
      toast.success('Inicio de sesión exitoso');
    } catch (err) {
      setError('Error al iniciar sesión.');
      toast.error('Usuario o contraseña no válida');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Contraseña:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
        )}
        {error && <p>{error}</p>}
        <p className="register-link">¿No estás registrado? <Link to="/register">Regístrate aquí</Link></p>
      </div>
    </div>
  );
};

export default Login;

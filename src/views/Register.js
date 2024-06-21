import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });

  const [loading, setLoading] = useState(false); // Estado para el loading
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
      await axios.post('http://localhost:8000/api/register', formData);
      navigate('/login');
      toast.success('Registro exitoso. Ya puedes iniciar sesión.');
    } catch (err) {
      setError('Error al registrar usuario.');
      toast.error('Error al registrar usuario');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Registro</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Nombre:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Contraseña:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <label>Dirección:</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <button type="submit">Registrar</button>
          </form>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Register;

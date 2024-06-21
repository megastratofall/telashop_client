// src/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt, faList } from '@fortawesome/free-solid-svg-icons';

const Header = ({ isLoggedIn, onLogout, user }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    await onLogout();
    navigate('/login');
    setLoggingOut(false);
  };

  return (
    <div className="navbar">
      <ul>
        {isLoggedIn ? (
          <>
            <li>
              <span className="welcome-message">Bienvenido {user.name}</span>
            </li>
            <li><Link to="/products"><FontAwesomeIcon icon={faList} /> Productos</Link></li>
            <li><Link to="/cart"><FontAwesomeIcon icon={faShoppingCart} /> Carrito</Link></li>
            <li><Link to="/profile"><FontAwesomeIcon icon={faUser} /> Mi perfil</Link></li>
            <li>
              <button className="logout-button" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? 'Cerrando sesión...' : <><FontAwesomeIcon icon={faSignOutAlt} /> Logout</>}
              </button>
            </li>
          </>
        ) : (
            <>
              <li><Link to="/register">Registrar</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
      </ul>
    </div>
  );
};

export default Header;

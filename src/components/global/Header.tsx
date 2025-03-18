import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Header.css'; // Vous pouvez créer ce fichier pour styliser votre header

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'nav__link active' : 'nav__link'}
            >
              Accueil
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? 'nav__link active' : 'nav__link'}
            >
              À propos
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink
              to="/contact"
              className={({ isActive }) => isActive ? 'nav__link active' : 'nav__link'}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const styles = {
  navbar: {
    background: 'linear-gradient(90deg, #003366, #0059b3)',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
  },
  brand: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '1.6rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    userelect: 'none',
  },
  menuIcon: {
    fontSize: '28px',
    cursor: 'pointer',
    userelect: 'none',
    padding: '6px',
    borderRadius: '6px',
    transition: 'background-color 0.3s',
  },
  menuIconHover: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '280px',
    backgroundColor: '#ffffff',
    padding: '5rem 1.5rem 1.5rem',
    boxShadow: '4px 0 20px rgba(0,0,0,0.12)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.35s ease-in-out',
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
    borderTopRightRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  sidebarVisible: {
    transform: 'translateX(0)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    zIndex: 1100,
  },
  link: {
    backgroundColor: '#f5f7fa',
    color: '#003366',
    border: 'none',
    padding: '14px 20px',
    margin: '0.5rem 0',
    borderRadius: '14px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    textAlign: 'left',
    textDecoration: 'none',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(0, 51, 102, 0.15)',
    transition: 'background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
    userelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  linkHover: {
    backgroundColor: '#0059b3',
    color: '#ffffff',
    boxShadow: '0 4px 14px rgba(0, 89, 179, 0.4)',
  },
  activeLink: {
    backgroundColor: '#004080',
    color: '#fff',
    fontWeight: '700',
    boxShadow: 'inset 4px 0 0 #00264d',
  },
};

const menuItems = [
  { path: '/user', label: 'User' },
  { path: '/devices', label: 'Devices' },
  { path: '/deviceAnalysis', label: 'Device Analysis' },
];

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [menuIconHover, setMenuIconHover] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div
          style={{
            ...styles.menuIcon,
            ...(menuIconHover ? styles.menuIconHover : {}),
          }}
          onClick={() => setShowSidebar(true)}
          onMouseEnter={() => setMenuIconHover(true)}
          onMouseLeave={() => setMenuIconHover(false)}
        >
          &#9776;
        </div>

        <div style={styles.brand}>RO PLANT</div>
      </nav>

      {showSidebar && (
        <div
          style={styles.overlay}
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        style={{
          ...styles.sidebar,
          ...(showSidebar ? styles.sidebarVisible : {}),
        }}
      >
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setShowSidebar(false)}
              style={{
                ...styles.link,
                ...(hovered === idx ? styles.linkHover : {}),
                ...(isActive ? styles.activeLink : {}),
              }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={() => {
            setShowSidebar(false);
            handleLogout();
          }}
          style={{
            ...styles.link,
            backgroundColor: '#d9534f',
            color: '#fff',
            fontWeight: '700',
          }}
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default Navbar;

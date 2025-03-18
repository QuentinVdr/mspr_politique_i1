import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { NavLink, NavLinkProps } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


interface NavLinkButtonProps extends NavLinkProps {
  children: React.ReactNode;
}

const NavLinkButton = React.forwardRef<HTMLAnchorElement, NavLinkButtonProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    return (
      <NavLink
        ref={ref}
        {...rest}
        style={({ isActive }) => ({
          textDecoration: 'none',
          color: 'inherit',
          fontWeight: isActive ? 'bold' : 'normal',
        })}
      >
        <Button color="inherit">{children}</Button>
      </NavLink>
    );
  }
);

NavLinkButton.displayName = 'NavLinkButton';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mon Application
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <NavLinkButton to="/">Accueil</NavLinkButton>
          <NavLinkButton to="/about">À propos</NavLinkButton>
          <NavLinkButton to="/contact">Contact</NavLinkButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

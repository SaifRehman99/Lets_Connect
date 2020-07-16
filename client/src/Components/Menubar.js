import React, { useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react';

import { Link } from 'react-router-dom';

import { AuthContext } from '../Context/auth';

const MenuExampleSecondaryPointing = ({ history, match }) => {
  const { user, logout } = useContext(AuthContext);

  const pathname = window.location.pathname;

  const path = pathname === '/' ? 'home' : pathname.slice(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menubar = user ? (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item name={user.username} active onClick={handleItemClick} as={Link} to='/' />
      <Menu.Menu position='right'>
        <Menu.Item name='logout' onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item name='home' active={activeItem === 'home'} onClick={handleItemClick} as={Link} to='/' />
      <Menu.Menu position='right'>
        <Menu.Item name='login' active={activeItem === 'login'} onClick={handleItemClick} as={Link} to='/login' />
        <Menu.Item name='register' active={activeItem === 'register'} onClick={handleItemClick} as={Link} to='/register' />
      </Menu.Menu>
    </Menu>
  );

  return menubar;
};

export default MenuExampleSecondaryPointing;

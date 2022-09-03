import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/redux/withReducer';
import { NavLink } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/redux/userSlice';
import reducer from 'app/redux/userPanel';

//importación acciones
import { toggleUserPanel } from 'app/redux/userPanel/userPanelSlice';

function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [userMenu, setUserMenu] = useState(null);

  //funciones

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const userPanelClick = ()=>{
    userMenuClose();
    dispatch(toggleUserPanel());
  };

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user.data.displayName}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="text.secondary">
            {user.role.toString()}
            {(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
          </Typography>
        </div>

        {user.data.photoURL ? (
          <Avatar className="md:mx-4" alt="user photo" src={user.data.photoURL} />
        ) : (
          <Avatar className="md:mx-4">{user.data.displayName[0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <>
          <MenuItem onClick={userPanelClick} role="button">
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Perfil de usuario" />
          </MenuItem>         
          <MenuItem
            component={NavLink}
            to="/sign-out"
            onClick={() => {
              userMenuClose();
            }}
          >
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </MenuItem>
        </>
      </Popover>
    </>
  );
}

export default withReducer('userPanelSlice', reducer)(UserMenu);

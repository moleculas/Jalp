import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { motion } from 'framer-motion';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';

//importaciones acciones
import { closeDialog, openDialog } from 'app/redux/fuse/dialogSlice';
import { eliminarUsuario } from 'app/redux/userSlice';
import { usuariosSeleccionados } from 'app/redux/usuariosSlice';

function EliminarUsuarioTab() {
  const dispatch = useDispatch();
  //const usuarios = useSelector((state) => state.usuarios.usuarios);
  const usuarios = useSelector(usuariosSeleccionados);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState({ _id: '' });

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  //funciones

  const handleEliminarUsuario = () => {
    dispatch(eliminarUsuario(usuarioAEliminar._id));
    setUsuarioAEliminar({ _id: '' });
  };

  const handleChangeSelect = () => (e) => {
    let objetoUsuario = usuarios.find(o => o._id === e.target.value);
    setUsuarioAEliminar(objetoUsuario);
  };

  const dialogAsegurar = () => {
    dispatch(
      openDialog({
        children: (
          <>
            <DialogTitle>¿Estás seguro que quieres eliminar al usuario?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <span>Estás a punto de eliminar al usuario: </span>
                <span>{usuarioAEliminar.displayName}</span>
              </DialogContentText>
            </DialogContent>
            <DialogActions className="pr-24 pb-24">
              <Button
                onClick={() => {
                  dispatch(closeDialog());
                }}
                color="primary"
                size="small"
                autoFocus
              >
                No
              </Button>
              <Button
                onClick={() => {
                  handleEliminarUsuario();
                  dispatch(closeDialog());
                }}
                color="secondary"
                autoFocus
                variant="contained"
                size="small"
              >
                Sí
              </Button>
            </DialogActions>
          </>
        ),
      })
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="container">
      <motion.div className="p-10 sm:p-10" variants={item}>
        <div className="grid grid-cols-1">
          <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
            Eliminar usuario
          </Typography>
          <div className="mt-2 mb-40 font-medium">
            <Typography>Selecciona el usuario que deseas eliminar.</Typography>
          </div>
        </div>
        <div className="grid grid-cols1 sm:grid-cols-2">
          <div className="w-full">
            <FormControl fullWidth>
              <InputLabel >Usuarios</InputLabel>
              <Select
                value={usuarioAEliminar._id}
                label="Usuarios"
                onChange={handleChangeSelect()}
              >
                {
                  usuarios.map((usuario, index) => (
                    <MenuItem key={index} value={usuario._id}>
                      {usuario.displayName}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            {usuarioAEliminar.displayName && (
              <Paper className="flex flex-col flex-auto shadow rounded-2xl mt-20 px-20">
                <List>
                  <ListItem className="px-0 -mx-8">
                    <Avatar
                      alt={usuarioAEliminar.displayName}
                      src={usuarioAEliminar.photoURL}
                      className="mx-8"
                    />
                    <ListItemText
                      className="px-4"
                      primary={
                        <div className="flex items-center space-x-8">
                          <Typography
                            className="font-normal"
                            color="secondary"
                            paragraph={false}
                          >
                            {usuarioAEliminar.displayName}
                          </Typography>
                          <Typography className="capitalize" variant="caption">{usuarioAEliminar.role.toString()}</Typography>
                        </div>
                      }
                      secondary={usuarioAEliminar.email}
                    />
                  </ListItem>
                </List>
              </Paper>
            )}
            <Button
              variant="contained"
              color="error"
              className="w-full mt-32"
              disabled={usuarioAEliminar.displayName ? false : true}
              size="large"
              onClick={dialogAsegurar}
            >
              Eliminar usuario
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div >
  );
};

export default EliminarUsuarioTab;

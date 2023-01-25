import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importación acciones
import { usuariosSeleccionados, obtenerUsuarios } from 'app/redux/usuariosSlice';

function TeamMembersWidget(props) {
  const dispatch = useDispatch();
  const usuarios = useSelector(usuariosSeleccionados);
  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  const [members, setMembers] = useState([]);

  //useEffect

  useEffect(() => {
    dispatch(obtenerUsuarios(false));
  }, []);

  useEffect(() => {
    if (usuarios?.length > 0) {
      gestionarUsuarios();
    };
  }, [usuarios]);

  //funciones

  const gestionarUsuarios = () => {
    let usuariosArray = [];
    usuarios.map((usuario) => {
      let objetoUsuario = {};
      objetoUsuario.id = usuario._id;
      objetoUsuario.avatar = usuario.photoURL;
      objetoUsuario.name = usuario.displayName;
      objetoUsuario.email = usuario.email;
      objetoUsuario.phone = usuario.telefono.length > 0 ? usuario.telefono[0].telefono : '';
      objetoUsuario.title = usuario.role.toString();
      usuariosArray.push(objetoUsuario);
    });
    setMembers(usuariosArray);
  };

  if (!usuarios) {
    return null
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24 w-full min-w-0"
    >
      {members.map((member) => (
        <Paper
          component={motion.div}
          variants={item}
          className="flex flex-col flex-auto items-center shadow rounded-2xl overflow-hidden"
          key={member.id}
        >
          <div className="flex flex-col flex-auto w-full p-32 text-center">
            <div className="w-128 h-128 mx-auto rounded-full overflow-hidden">
              <img className="w-full h-full object-cover" src={member.avatar} alt="member" />
            </div>
            <Typography className="mt-24 font-medium">{member.name}</Typography>
            <Typography color="text.secondary" className="capitalize">{member.title}</Typography>
          </div>
          <div className="flex items-center w-full border-t divide-x">
            <a
              className="flex flex-auto items-center justify-center py-16 hover:bg-hover"
              href={`mailto:${member.email}`}
              role="button"
            >
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:mail
              </FuseSvgIcon>
              <Typography className="ml-8">Email</Typography>
            </a>
            <a
              className="flex flex-auto items-center justify-center py-16 hover:bg-hover"
              style={!member.phone ? { pointerEvents: 'none' } : { pointerEvents: 'auto' }}
              href={`tel${member.phone}`}
              role="button"
            >
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:phone
              </FuseSvgIcon>
              <Typography className="ml-8">Llamar</Typography>
            </a>
          </div>
        </Paper>
      ))}
    </motion.div>
  );
}

export default memo(TeamMembersWidget);

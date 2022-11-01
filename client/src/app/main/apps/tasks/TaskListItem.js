import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemIcon from '@mui/material/ListItemIcon';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import Typography from '@mui/material/Typography';
import _ from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';

//importaciones acciones
import { usuariosSeleccionados, obtenerUsuarios } from 'app/redux/usuariosSlice';

function TaskListItem(props) {
  const { data, index } = props;
  const dispatch = useDispatch();
  const usuarios = useSelector(usuariosSeleccionados);
  const [cargadoUsuarios, setCargadoUsuarios] = useState(false);

  //useEffect

  useEffect(() => {
    dispatch(obtenerUsuarios(false)).then(() => {
      setCargadoUsuarios(true);
    });
  }, []);

  if (!cargadoUsuarios) {
    return null
  };

  return (
    cargadoUsuarios && (
      <Draggable draggableId={data.id} index={index} type="list">
        {(provided, snapshot) => (
          <>
            <ListItem
              className={clsx(snapshot.isDragging ? 'shadow-lg' : 'shadow', 'px-40 py-12 group')}
              sx={{ bgcolor: 'background.paper' }}
              button
              component={NavLinkAdapter}
              to={`/apps/tasks/${data.id}`}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <div
                className="md:hidden absolute flex items-center justify-center inset-y-0 left-0 w-32 cursor-move md:group-hover:flex"
                {...provided.dragHandleProps}
              >
                <FuseSvgIcon sx={{ color: 'text.disabled' }} size={20}>
                  heroicons-solid:menu
                </FuseSvgIcon>
              </div>
              <ListItemIcon className="min-w-40 mr-8 -ml-10 p-8">
                <FuseSvgIcon sx={{ color: data.completed ? 'secondary.main' : 'text.disabled' }}>heroicons-outline:check-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText classes={{ root: 'm-0', primary: 'truncate' }} primary={data.title} />
              <div className="flex items-center space-x-8">
                {data.asignadaA.length > 0 && (
                  <div className="mr-12 hidden md:flex items-center space-x-8">
                    <Typography className="text-12 whitespace-nowrap" color="text.secondary">
                      Asignada a:
                    </Typography>
                    {data.asignadaA.map((asignado, index) => {
                      const usuario = usuarios[usuarios.findIndex(usuario => usuario._id === asignado)];
                      if (index === 0) {
                        return (
                          <Chip
                            key={'usuario' + index}
                            avatar={<Avatar alt={usuario.displayName} src={usuario.photoURL} />}
                            label={usuario.displayName}
                          />
                        )
                      };
                      if (index === 1) {
                        return (
                          <Typography className="text-12 whitespace-nowrap" color="text.secondary">
                            ( +  ... )
                          </Typography>
                        )
                      };
                    })}
                  </div>
                )}
                <div className="flex items-center space-x-8">
                  <Typography className="text-12 whitespace-nowrap" color="text.secondary">
                    Prioridad:
                  </Typography>
                  {data.priority === 0 && (
                    <FuseSvgIcon className="text-green icon-size-16">
                      heroicons-outline:arrow-narrow-down
                    </FuseSvgIcon>
                  )}
                  {data.priority === 1 && (
                    <FuseSvgIcon className="icon-size-16">
                      heroicons-solid:minus
                    </FuseSvgIcon>
                  )}
                  {data.priority === 2 && (
                    <FuseSvgIcon className="text-red icon-size-16 ">
                      heroicons-outline:arrow-narrow-up
                    </FuseSvgIcon>
                  )}
                </div>
                {data.dueDate && (
                  <div className="flex items-center space-x-8">
                    <Typography className="text-12 whitespace-nowrap" color="text.secondary">
                      Vencimiento:
                    </Typography>
                    <Typography className="text-12 whitespace-nowrap" color="text.secondary">
                      {_.capitalize(format(new Date(data.dueDate), 'LLL dd', { locale: es }))}
                    </Typography>
                  </div>
                )}
              </div>
            </ListItem>
            <Divider />
          </>
        )}
      </Draggable>
    )
  );
}

export default TaskListItem;

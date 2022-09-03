import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from '@lodash';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/redux/userSlice';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';

//importación acciones
import {
  selectDataInicioHeader
} from 'app/redux/produccion/inicioSlice';

function ProjectDashboardAppHeader(props) {
  const projects = [{ id: 1, name: 'Analíticas' }];
  const user = useSelector(selectUser);
  const dataInicio = useSelector(selectDataInicioHeader);

  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    menuEl: null,
  });

  //funciones

  function handleChangeProject(id) {
    setSelectedProject({
      id,
      menuEl: null,
    });
  };

  function handleOpenProjectMenu(event) {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: event.currentTarget,
    });
  };

  function handleCloseProjectMenu() {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: null,
    });
  };

  const retornaRecordatorio = () => {
    if (dataInicio.notesInicio.length === 0 && dataInicio.eventsInicio.length === 0 && dataInicio.tasksInicio.length === 0) {
      return 'No hay objetos pendientes este mes'
    };
    let textoNotas = "";
    let textoEvents = "";
    let textoTasks = "";
    const mes = format(new Date(), "MMMM", { locale: es });
    if (dataInicio.notesInicio.length === 1) {
      textoNotas = dataInicio.notesInicio.length + " recordatorio, ";
    } else {
      textoNotas = dataInicio.notesInicio.length + " recordatorios, ";
    };
    if (dataInicio.eventsInicio.length === 1) {
      textoEvents = dataInicio.eventsInicio.length + " evento, ";
    } else {
      textoEvents = dataInicio.eventsInicio.length + " eventos, ";
    };
    if (dataInicio.tasksInicio.length === 1) {
      textoTasks = dataInicio.tasksInicio.length + " tarea, ";
    } else {
      textoTasks = dataInicio.tasksInicio.length + " tareas, ";
    };
    return "Tienes " + textoNotas + textoEvents + textoTasks + "pendientes para el mes de " + _.upperFirst(mes);
  };

  if (_.isEmpty(projects)) {
    return null;
  };

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-24">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar className="flex-0 w-64 h-64" alt="user photo" src={user?.data?.photoURL}>
            {user?.data?.displayName[0]}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {`Bienvenid@, ${user.data.displayName}`}
            </Typography>

            <div className="flex items-center">
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:bell
              </FuseSvgIcon>
              <Typography className="mx-6 leading-6 truncate" color="text.secondary">
                {retornaRecordatorio()}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {projects.length > 1 && (
          <>
            <Button
              onClick={handleOpenProjectMenu}
              className="flex items-center border border-solid border-b-0 rounded-t-xl rounded-b-0 h-40 px-16 text-13 sm:text-16"
              variant="default"
              sx={{
                backgroundColor: (theme) => theme.palette.background.default,
                borderColor: (theme) => theme.palette.divider,
              }}
              endIcon={
                <FuseSvgIcon size={20} color="action">
                  heroicons-solid:chevron-down
                </FuseSvgIcon>
              }
            >
              {_.find(projects, ['id', selectedProject.id]).name}
            </Button>
            <Menu
              id="project-menu"
              anchorEl={selectedProject.menuEl}
              open={Boolean(selectedProject.menuEl)}
              onClose={handleCloseProjectMenu}
            >
              {projects &&
                projects.map((project) => (
                  <MenuItem
                    key={project.id}
                    onClick={(ev) => {
                      handleChangeProject(project.id);
                    }}
                  >
                    {project.name}
                  </MenuItem>
                ))}
            </Menu>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectDashboardAppHeader;

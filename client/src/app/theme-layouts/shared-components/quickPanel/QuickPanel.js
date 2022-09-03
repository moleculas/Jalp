import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withReducer from 'app/redux/withReducer';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import reducer from 'app/redux/quickPanel';
import { Link } from 'react-router-dom';

//importación acciones
import {
  selectQuickPanelDataNotes,
  selectQuickPanelDataEvents,
  selectQuickPanelDataTasks
} from 'app/redux/quickPanel/dataSlice';
import { selectQuickPanelState, toggleQuickPanel } from 'app/redux/quickPanel/stateSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background,
    width: 280,
    height: 'calc(100% - 64px)',
    top: 64,
    borderLeft: '1px solid rgb(226, 232, 240)',
    borderTop: '1px solid rgb(226, 232, 240)',
  },
}));

function QuickPanel(props) {
  const dispatch = useDispatch();
  const notes = useSelector(selectQuickPanelDataNotes);
  const events = useSelector(selectQuickPanelDataEvents);
  const tasks = useSelector(selectQuickPanelDataTasks);
  const state = useSelector(selectQuickPanelState);

  //funciones 

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => { }}
      onClose={(ev) => dispatch(toggleQuickPanel())}
      BackdropProps={{ invisible: true }}
      disableSwipeToOpen
      elevation={0}
    >
      <FuseScrollbars>
        <ListSubheader component="div">Hoy</ListSubheader>
        <div className="mb-0 py-16 px-24">
          <Typography className="mb-12 text-32 capitalize" color="text.secondary">
            {format(new Date(), 'eeee', { locale: es })}
          </Typography>
          <div className="flex">
            <Typography className="leading-none text-32" color="text.secondary">
              {format(new Date(), 'dd')}
            </Typography>
            <Typography className="leading-none text-16 mt-12 mx-6" color="text.secondary">de</Typography>
            <Typography className="leading-none text-32 capitalize" color="text.secondary">
              {format(new Date(), 'MMMM', { locale: es })}
            </Typography>
          </div>
        </div>
        <Divider />
        <List>
          <ListSubheader component="div">
            <div className="flex items-center mt-10 mb-6">
              <FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
              <Typography className="font-semibold ml-10">
                Eventos
              </Typography>
            </div>
          </ListSubheader>
          {events && events.length > 0 ?
            events.map((event) => (
              <ListItem key={event.id}>
                <ListItemText
                  primary={
                    <Link
                      className="cursor-pointer"
                      to={'/apps/calendar'}
                      onClick={() => dispatch(toggleQuickPanel())}
                    >
                      {event.title}
                    </Link>
                  }
                  secondary={'Todo el día'}
                />
              </ListItem>
            )) : (
              <ListItem key={0}>
                <ListItemText
                  secondary={'No hay eventos para el día de hoy'} />
              </ListItem>
            )}
        </List>
        <Divider />
        <List>
          <ListSubheader component="div">
            <div className="flex items-center mt-10 mb-6">
              <FuseSvgIcon>heroicons-outline:pencil-alt</FuseSvgIcon>
              <Typography className="font-semibold ml-10">
                Notas
              </Typography>
            </div>
          </ListSubheader>
          {notes && notes.length > 0 ?
            notes.map((note) => (
              <ListItem key={note.id}>
                <ListItemText
                  primary={
                    <Link
                      className="cursor-pointer"
                      to={'/apps/notes'}
                      onClick={() => dispatch(toggleQuickPanel())}
                    >
                      {note.title}
                    </Link>
                  }
                  secondary={
                    'Hoy a las ' + format(new Date(note.detail), 'HH:mm a', { locale: es })
                  } />
              </ListItem>
            )) : (
              <ListItem key={0}>
                <ListItemText
                  secondary={'No hay recordatorios para el día de hoy'} />
              </ListItem>
            )}
        </List>
        <Divider />
        <List>
          <ListSubheader component="div">
            <div className="flex items-center mt-10 mb-6">
              <FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
              <Typography className="font-semibold ml-10">
                Tareas
              </Typography>
            </div>
          </ListSubheader>
          {tasks && tasks.length > 0 ?
            tasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText
                  primary={
                    <Link
                      className="cursor-pointer"
                      to={`/apps/tasks/${task.id}`}
                      onClick={() => dispatch(toggleQuickPanel())}
                    >
                      {task.title}
                    </Link>
                  }
                  secondary={
                    'Hoy a las ' + format(new Date(task.dueDate), 'HH:mm a', { locale: es })
                  } />
              </ListItem>
            )) : (
              <ListItem key={0}>
                <ListItemText
                  secondary={'No hay tareas para el día de hoy'} />
              </ListItem>
            )}
        </List>
      </FuseScrollbars>
    </StyledSwipeableDrawer>
  );
}

export default withReducer('quickPanel', reducer)(memo(QuickPanel));

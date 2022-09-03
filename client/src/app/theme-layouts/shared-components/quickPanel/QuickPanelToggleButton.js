import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import { useEffect, useState } from 'react';
import reducer from 'app/redux/quickPanel';
import withReducer from 'app/redux/withReducer';

//importación acciones
import { toggleQuickPanel } from 'app/redux/quickPanel/stateSlice';
import {
  getNotes,
  getEvents,
  getTasks,
  selectQuickPanelDataNotes,
  selectQuickPanelDataEvents,
  selectQuickPanelDataTasks
} from 'app/redux/quickPanel/dataSlice';


function QuickPanelToggleButton(props) {
  const dispatch = useDispatch();
  const notes = useSelector(selectQuickPanelDataNotes);
  const events = useSelector(selectQuickPanelDataEvents);
  const tasks = useSelector(selectQuickPanelDataTasks);
  const [badgeActivo, setBadgeActivo] = useState(false);

  //useEffect

  useEffect(() => {
    dispatch(getNotes());
    dispatch(getEvents());
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (notes.length > 0 || events.length > 0 || tasks.length > 0) {
      setBadgeActivo(true);
    };
  }, [notes, events, tasks]);

  return (
    <Tooltip title="Panel de información" placement="bottom">
      <IconButton className="w-40 h-40" onClick={(ev) => dispatch(toggleQuickPanel())} size="large">
        <Badge color="secondary" variant="dot" invisible={!badgeActivo}>
          <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon>
        </Badge>
      </IconButton>
    </Tooltip>
  );
}

export default withReducer('quickPanel', reducer)(QuickPanelToggleButton);

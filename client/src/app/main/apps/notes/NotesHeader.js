import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NotesSearch from './NotesSearch';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';

//importación acciones
import { openNoteDialog } from 'app/redux/notes/notesSlice';

function NotesHeader(props) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col sm:flex-row flex-1 items-center justify-between space-y-16 sm:space-y-0 p-24 sm:p-32 sm:px-32 relative">
      <div className="flex shrink items-center sm:w-224">
        <Hidden lgUp>
          <IconButton
            onClick={(ev) => props.onSetSidebarOpen(true)}
            aria-label="open left sidebar"
            size="large"
          >
            <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
          </IconButton>
        </Hidden>
        <div className="flex items-center">
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="text-24 md:text-32 font-extrabold tracking-tight leading-none"
          >
            Notas
          </Typography>
        </div>
      </div>
      <div className="flex flex-1 w-full sm:w-auto items-center justify-end space-x-12">
        <NotesSearch />
        <Button
          className="mx-8 whitespace-nowrap"
          variant="contained"
          color="secondary"
          onClick={() => dispatch(openNoteDialog('new'))}
        >
          <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-8">Crear Nota</span>
        </Button>
      </div>
    </div>
  );
}

export default NotesHeader;

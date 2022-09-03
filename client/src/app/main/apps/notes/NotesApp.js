import withReducer from 'app/redux/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lighten, styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import LabelsDialog from './dialogs/labels/LabelsDialog';
import NoteDialog from './dialogs/note/NoteDialog';
import NoteList from './NoteList';
import NotesHeader from './NotesHeader';
import NotesSidebarContent from './NotesSidebarContent';
import reducer from 'app/redux/notes';
import Typography from '@mui/material/Typography';

//importación acciones
import { getLabels } from 'app/redux/notes/labelsSlice';
import { getNotes } from 'app/redux/notes/notesSlice';
import { selectNotes } from 'app/redux/notes/notesSlice';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {},
  '& .FusePageCarded-sidebar': {},
  '& .FusePageCarded-leftSidebar': {},
}));

function NotesApp(props) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const routeParams = useParams();
  const notes = useSelector(selectNotes);

  //useEffect

  useEffect(() => {
    dispatch(getNotes(routeParams));
    dispatch(getLabels());
  }, [dispatch, routeParams]);

  return (
    <>
      <Root
        header={<NotesHeader onSetSidebarOpen={setLeftSidebarOpen} />}
        content={
          <div className="flex flex-col w-full items-center p-24">
            <Box
              className="w-full rounded-16 border p-12 flex flex-col items-center"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >              
              {notes.length > 0 ? (
                <NoteList />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Typography color="text.secondary" variant="h5">
                    No hay notas
                  </Typography>
                </div>
              )}
            </Box>
            <NoteDialog />
            <LabelsDialog />
          </div>
        }
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarOnClose={() => {
          setLeftSidebarOpen(false);
        }}
        leftSidebarContent={<NotesSidebarContent />}
        scroll={isMobile ? 'normal' : 'content'}
      />
    </>
  );
}

export default withReducer('notesApp', reducer)(NotesApp);

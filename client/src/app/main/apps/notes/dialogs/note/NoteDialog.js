import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeNoteDialog,
  selectDialogNote,
  selectNuevaNota,
  createNote
} from 'app/redux/notes/notesSlice';
import NoteForm from '../../note-form/NoteForm';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NoteDialog(props) {
  const dispatch = useDispatch();
  const note = useSelector(selectDialogNote);
  const nuevaNota = useSelector(selectNuevaNota);

  function handleCreate(note) {       
    dispatch(createNote(note));
    dispatch(closeNoteDialog());
  };

  if (!note && !nuevaNota) {
    return null;
  };

  return (
    <Dialog
      classes={{
        paper: 'w-full m-24',
      }}
      TransitionComponent={Transition}
      onClose={(ev) => dispatch(closeNoteDialog())}
      open={Boolean(note?.id) || nuevaNota}
    >
      {nuevaNota && (
        <NoteForm
          variant="new"
          onCreate={handleCreate}
          onClose={(ev) => dispatch(closeNoteDialog())}
        />)}
      {note && (
        <NoteForm
          note={note}
          onClose={(ev) => dispatch(closeNoteDialog())}
        />)
      }
    </Dialog>
  );
}

export default NoteDialog;

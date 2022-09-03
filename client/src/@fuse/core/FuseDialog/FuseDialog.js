import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialog,
  selectFuseDialogOptions,
  selectFuseDialogState,
} from 'app/redux/fuse/dialogSlice';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FuseDialog(props) {
  const dispatch = useDispatch();
  const state = useSelector(selectFuseDialogState);
  const options = useSelector(selectFuseDialogOptions);

  return (
    <Dialog
      open={state}
      TransitionComponent={Transition}
      onClose={(ev) => dispatch(closeDialog())}
      aria-labelledby="fuse-dialog-title"
      classes={{
        paper: 'rounded-8',
      }}
      {...options}
    />
  );
}

export default FuseDialog;

import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FormFileManagerFile from './FormFileManagerFile';
import FormFileManagerFolder from './FormFileManagerFolder';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

//importación acciones
import {
  setSelectedButton,
  setSelectedItemAEditar,
  selectSelectedButton,
  selectSelectedItemAEditar
} from 'app/redux/file-manager/itemsSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background,
    width: 400,
    height: 'calc(100% - 181px)',
    top: 181,
    borderLeft: '1px solid rgb(226, 232, 240)'
  },
}));

function FormFileManager(props) {
  const dispatch = useDispatch();
  const selectedButton = useSelector(selectSelectedButton);
  const selectedItemAEditar = useSelector(selectSelectedItemAEditar);

  return (
    <>
      <StyledSwipeableDrawer
        open={selectedButton || selectedItemAEditar ? true : false}
        anchor="right"
        onOpen={(ev) => { }}
        onClose={() => {
          selectedButton && (dispatch(setSelectedButton(null)));
          selectedItemAEditar && (dispatch(setSelectedItemAEditar(null)));
        }}
        disableSwipeToOpen
        BackdropProps={{ invisible: true }}
        elevation={0}
      >
        <div className="flex items-center justify-end w-full border-b-1 mb-32">
          <IconButton className="mb-16 mt-16 mr-16" size="large" onClick={() => {
            selectedButton && (dispatch(setSelectedButton(null)));
            selectedItemAEditar && (dispatch(setSelectedItemAEditar(null)));
          }}>
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
        </div>
        {selectedButton && (selectedButton === 'folder' ? (<FormFileManagerFolder />) : (<FormFileManagerFile />))}
        {selectedItemAEditar && (selectedItemAEditar.type === 'folder' ? (<FormFileManagerFolder />) : (<FormFileManagerFile />))}
      </StyledSwipeableDrawer>
    </>
  );
}

export default FormFileManager;

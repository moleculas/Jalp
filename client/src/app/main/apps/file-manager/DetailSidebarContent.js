import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import DetailSidebarContentFile from './DetailSidebarContentFile';

//importación acciones
import {
  setSelectedItem,
  selectSelectedItem
} from 'app/redux/file-manager/itemsSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background,
    width: 400,
    borderLeft: '1px solid rgb(226, 232, 240)'
  },
}));

function DetailSidebarContent(props) {
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectSelectedItem);

  return (
    <>
      <StyledSwipeableDrawer
        open={selectedItem ? true : false}
        anchor="right"
        onOpen={(ev) => { }}
        onClose={() => dispatch(setSelectedItem(null))}
        disableSwipeToOpen
        BackdropProps={{ invisible: true }}
        elevation={0}
        sx={{
          '& .MuiDrawer-paper': {
            height: {
              sm: '100%',
              md: 'calc(100% - 181px)'
            },
            top: {
              sm: 0,
              md: 181
            },
          }
        }}
      >
        <div className="flex items-center justify-end w-full border-b-1">
          <IconButton className="mb-16 mt-16 mr-16" size="large" onClick={() => dispatch(setSelectedItem(null))}>
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
        </div>
        <DetailSidebarContentFile />
      </StyledSwipeableDrawer>
    </>
  );
}

export default DetailSidebarContent;

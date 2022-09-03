import { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ChatAppContext } from '../../ChatApp';

const MainSidebarMoreMenu = (props) => {
  const { setUserSidebarOpen } = useContext(ChatAppContext);
  const { className } = props;
  const [moreMenuEl, setMoreMenuEl] = useState(null);

  //funciones
  
  function handleMoreMenuClose(event) {
    setMoreMenuEl(null);
  }
  return (
    <div className={className}>
      <IconButton
        aria-owns={moreMenuEl ? 'main-more-menu' : null}
        aria-haspopup="true"
        onClick={() => {
          setUserSidebarOpen(true);
          handleMoreMenuClose();
        }}
        size="large"
      >
        <FuseSvgIcon>material-outline:edit_notifications</FuseSvgIcon>
      </IconButton>     
    </div>
  );
};

export default MainSidebarMoreMenu;

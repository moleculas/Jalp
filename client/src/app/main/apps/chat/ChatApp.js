import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import withReducer from 'app/redux/withReducer';
import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import MainSidebar from './sidebars/main/MainSidebar';
import reducer from 'app/redux/chat';
import { getUserData } from 'app/redux/chat/userSlice';
import { getContacts } from 'app/redux/chat/contactsSlice';
import UserSidebar from './sidebars/user/UserSidebar';
import { getChats } from 'app/redux/chat/chatsSlice';

const drawerWidth = 400;

export const ChatAppContext = createContext({});

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-content': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    height: '100%',
  },
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    maxWidth: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
}));
function ChatApp(props) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const location = useLocation();

  //useEffect

  useEffect(() => {
    dispatch(getUserData()).then(() => {
      dispatch(getChats());
    });
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    setMainSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setMainSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <ChatAppContext.Provider
      value={{ setMainSidebarOpen, setUserSidebarOpen }}
    >
      <Root
        content={<Outlet />}
        leftSidebarContent={<MainSidebar />}
        leftSidebarOpen={mainSidebarOpen}
        leftSidebarOnClose={() => {
          setMainSidebarOpen(false);
        }}
        leftSidebarWidth={400}
        scroll="content"
      />
      <StyledSwipeableDrawer
        className="h-full absolute z-9999"
        variant="temporary"
        anchor="left"
        open={userSidebarOpen}
        onOpen={(ev) => { }}
        onClose={() => setUserSidebarOpen(false)}
        classes={{
          paper: 'absolute left-0',
        }}
        style={{ position: 'absolute' }}
        ModalProps={{
          keepMounted: false,
          disablePortal: true,
          BackdropProps: {
            classes: {
              root: 'absolute',
            },
          },
        }}
      >
        <UserSidebar />
      </StyledSwipeableDrawer>
    </ChatAppContext.Provider>
  );
}

export default withReducer('chatApp', reducer)(ChatApp);

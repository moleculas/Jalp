import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/redux/i18nSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/redux/fuse/settingsSlice';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import settingsConfig from 'app/configs/settingsConfig';
import withAppProviders from './withAppProviders';
import { AuthProvider } from './auth/AuthContext';
import axios from 'axios';
import { RUTA_API, RUTA_SERVER } from 'constantes';
import io from "socket.io-client";
import { useEffect } from 'react';

//importacion acciones
import { selectUser } from 'app/redux/userSlice';
import {
  setSocket,
  selectObjSocket
} from 'app/redux/socketSlice';

/**
 * Axios HTTP Request defaults
 */

axios.defaults.baseURL = RUTA_API;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

const emotionCacheOptions = {
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);
  const socket = useSelector(selectObjSocket);

  //useEffect

  useEffect(() => {
    if (!socket) {
        dispatch(setSocket(io(RUTA_SERVER)));
    };
}, []);

  return (
    <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
      <FuseTheme theme={mainTheme} direction={langDirection}>
        <AuthProvider>
          <BrowserRouter>
            <FuseAuthorization
              userRole={user.role}
              loginRedirectUrl={settingsConfig.loginRedirectUrl}
            >
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                classes={{
                  containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                }}
              >
                <FuseLayout layouts={themeLayouts} />
              </SnackbarProvider>
            </FuseAuthorization>
          </BrowserRouter>
        </AuthProvider>
      </FuseTheme>    
    </CacheProvider>
  );
};

export default withAppProviders(App)();

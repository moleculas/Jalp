import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/redux/fuse/messageSlice';
import jwtService from './services/jwtService';
import { setUser, logoutUser } from 'app/redux/userSlice';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.user);

  useEffect(() => {
    if (data.displayName) {
      setWaitAuthCheck(false);
      setIsAuthenticated(true);
    };
  }, [data]);

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      jwtService
        .signInWithToken();
    });

    jwtService.on('onLogin', (user) => {
      success(user, 'Autenticado.');
    });

    jwtService.on('onLogout', () => {
      pass('Sesión cerrada');
      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);
      dispatch(logoutUser());
    });

    jwtService.on('onErrorLogin', (message) => {      
      dispatch(showMessage({ message, variant: "error" }));      
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }
      dispatch(setUser(user));
      // setWaitAuthCheck(false);
      // setIsAuthenticated(true);
    };

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      };
      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };

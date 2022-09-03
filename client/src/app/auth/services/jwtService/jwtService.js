import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  };

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token.');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();
    if (!access_token) {
      this.emit('onNoAccessToken');
      return;
    };
    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);    
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'Sesión expirada.');
    }
  };

  signInWithEmailAndPassword = async (email, password) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    await axios.post(jwtServiceConfig.signIn, formData).then(response => {
      this.setSession(response.data.token);
      this.emit('onLogin', response.data.usuario);
      return;
    }).catch(err => {
      if(err.response.data){
        this.emit('onErrorLogin', err.response.data.message);
      }else{
        this.emit('onErrorLogin', 'Error de conexión con el servidor');
      };      
      return;
    });
  };

  signInWithToken = async () => {
    const formData = new FormData();
    const elToken = this.getAccessToken();
    formData.append("token", elToken);
    await axios.post(jwtServiceConfig.accessToken, formData).then(response => {
      this.setSession(response.data.token);
      this.emit('onLogin', response.data.usuario);
      return;
    }).catch(err => {
      this.logout();
      this.emit('onNoAccessToken');
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Sesión cerrada.');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('token');
  };
}

const instance = new JwtService();

export default instance;

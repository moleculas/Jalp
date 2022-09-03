import { styled } from '@mui/material/styles';
import { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import RegistrarUsuarioTab from './tabs/RegistrarUsuarioTab';
import EliminarUsuarioTab from './tabs/EliminarUsuarioTab';
import withReducer from 'app/redux/withReducer';
import reducer from 'app/redux/registrar-usuario';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

//importación acciones
import { obtenerUsuarios, usuariosSeleccionados } from 'app/redux/usuariosSlice';

const Root = styled(FusePageCarded)({
  '& .FusePageCarded-header': {},
  '& .FusePageCarded-toolbar': {},
  '& .FusePageCarded-content': {},
  '& .FusePageCarded-sidebarHeader': {},
  '& .FusePageCarded-sidebarContent': {},
});

function GestionUsuariosPage() {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [selectedTab, setSelectedTab] = useState(0);
  const usuarios = useSelector(usuariosSeleccionados);

  //useEffect

  useEffect(() => {
    dispatch(obtenerUsuarios(true));
  }, [dispatch]);

  //funciones

  function handleTabChange(event, value) {
    setSelectedTab(value);
  };

  return (
    <Root
      header={
        <div className="flex flex-col sm:flex-row flex-0 sm:items-center sm:justify-between pt-24 sm:pt-32 w-full">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center font-medium px-20 sm:px-40">
              <div>
                <Typography className="whitespace-nowrap" color="secondary.main">
                  Área de gestión usuario administrador
                </Typography>
              </div>
            </div>
            <div className="mt-8 px-20 sm:px-40 flex items-center">
              <Typography
                component={motion.span}
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.2 } }}
                delay={300}
                className="text-24 md:text-32 font-extrabold tracking-tight leading-none"
              >
                Gestión usuarios
              </Typography>
            </div>
            <div className="flex flex-col shadow mt-24 sm:mt-32 bg-white border !border-[#e2e8f0]/[.50] border-t-0 border-l-0 border-r-0 border-b-1">
              <div className="flex flex-row items-center w-full mx-auto px-32 lg:h-72">
                <div className="my-16 lg:my-0">
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="inherit"
                    variant="scrollable"
                    scrollButtons={false}
                    className="-mx-4 min-h-40"
                    classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                    TabIndicatorProps={{
                      children: (
                        <Box
                          sx={{ bgcolor: 'text.disabled' }}
                          className="w-full h-full rounded-full opacity-20"
                        />
                      ),
                    }}
                  >
                    <Tab
                      className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                      disableRipple
                      label="Registrar usuario"
                    />
                    {usuarios.length > 0 && (
                      <Tab
                        className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                        disableRipple
                        label="Eliminar usuario"
                      />
                    )}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      content={
        <div className="flex flex-auto justify-center w-full mx-auto p-24 sm:p-32">
          {selectedTab === 0 && <RegistrarUsuarioTab />}
          {selectedTab === 1 && <EliminarUsuarioTab />}
        </div>
      }      
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('registrarUsuario', reducer)(GestionUsuariosPage);

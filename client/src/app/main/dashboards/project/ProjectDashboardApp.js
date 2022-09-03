import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import withReducer from 'app/redux/withReducer';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ProjectDashboardAppHeader from './ProjectDashboardAppHeader';
import reducer from 'app/redux/produccion';
import HomeTab from './tabs/home/HomeTab';
import TeamTab from './tabs/team/TeamTab';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

//importación acciones
import {
  getNotesInicio,
  getEventsInicio,
  getTasksInicio,
  selectDataInicioWidgets,
  //getWidgets
} from 'app/redux/produccion/inicioSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },  
}));

function ProjectDashboardApp(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(selectDataInicioWidgets);
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  //useEffect

  useEffect(() => {
    //dispatch(getWidgets());
    dispatch(getNotesInicio());
    dispatch(getEventsInicio());
    dispatch(getTasksInicio());
  }, [dispatch]);

  //funciones

  function handleChangeTab(event, value) {
    setTabValue(value);
  };

  if (_.isEmpty(widgets)) {
    return null;
  };

  return (
    <Root
      header={<ProjectDashboardAppHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:pr-0">
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="w-full px-24 -mx-4 min-h-40"
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
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Inicio"
            />           
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Equipo"
            />
          </Tabs>
          {tabValue === 0 && <HomeTab />}
          {tabValue === 1 && <TeamTab />}
        </div>
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('produccionSeccion', reducer)(ProjectDashboardApp);

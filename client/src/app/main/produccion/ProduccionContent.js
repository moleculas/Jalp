import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import _ from '@lodash';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

//importación acciones

function ProduccionContent(props) {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  //useEffect

  useEffect(() => {
    tabValue === 0 && navigate("produccion-0");
    tabValue === 1 && navigate("produccion-1/mod-1");
    tabValue === 2 && navigate("produccion-2/mod-1");
    tabValue === 3 && navigate("produccion-3/mod-1");   
    tabValue === 4 && navigate("produccion-lx");  
  }, [tabValue]);

  //funciones

  function handleChangeTab(event, value) {
    setTabValue(value);
  };

  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="py-14 sticky top-0 !z-50 bg-[#f1f5f9] border-b-1">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="w-full px-32 -mx-4 min-h-40"
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
            label="Inicio datos"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Producción Palets"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Producción Tacos"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Producción Patines"
          />      
           <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Salida Palets"
          />   
        </Tabs>
      </div>
      <Outlet />
    </div>
  );
}

export default ProduccionContent;

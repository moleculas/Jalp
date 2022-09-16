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
    tabValue === 0 && navigate("produccion-1/mod-1");
    tabValue === 1 && navigate("produccion-4");
    tabValue === 2 && navigate("objetivos");
  }, [tabValue]);

  //funciones

  function handleChangeTab(event, value) {
    setTabValue(value);
  };

  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="py-14 sticky top-0 z-10 bg-[#f1f5f9] border-b-1">
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
            label="Palets 1070, 1140, 1003"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Escandallo LX Pino"
          />
           <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Objetivos"
          />
        </Tabs>
      </div>
      <Outlet />
    </div>
  );
}

export default ProduccionContent;

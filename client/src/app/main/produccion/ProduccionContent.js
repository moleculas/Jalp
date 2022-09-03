import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import _ from '@lodash';
import { useState } from 'react';
import Box from '@mui/material/Box';
import CubicajeTacos from './tabs/cubicaje-tacos/CubicajeTacos';

//importación acciones

function ProduccionContent(props) {
  const [tabValue, setTabValue] = useState(0);

  //useEffect

  //funciones

  function handleChangeTab(event, value) {
    setTabValue(value);
  };

  return (
    <div className="w-full flex flex-col min-h-full">
      {/* <div className="py-14 lg:pr-0 border !border-[#e2e8f0]/[.50] border-t-0 border-l-0 border-r-0 border-b-1 sticky top-0 z-10 bg-white"> */}
      <div className="py-14 lg:pr-0 sticky top-0 z-10 bg-[#f1f5f9] border-b-1">
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
            label="Escandallo LX Pino"
          />
        </Tabs>
      </div>
      {tabValue === 0 && <CubicajeTacos />}
    </div>
  );
}

export default ProduccionContent;

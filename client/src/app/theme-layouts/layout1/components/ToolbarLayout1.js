import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from 'app/redux/fuse/settingsSlice';
import { selectFuseNavbar } from 'app/redux/fuse/navbarSlice';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import NavigationShortcuts from '../../shared-components/NavigationShortcuts';
import NavigationSearch from '../../shared-components/NavigationSearch';
import NavbarToggleButton from '../../shared-components/NavbarToggleButton';
import UserMenu from '../../shared-components/UserMenu';
import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import { useEffect, useState } from 'react';

function ToolbarLayout1(props) {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar = useSelector(selectFuseNavbar);
  const toolbarTheme = useSelector(selectToolbarTheme);
  const [fechaHora, setFechaHora] = useState(format(new Date(), 'dd LLL, HH:mm', { locale: es }));

  //useEffect

  useEffect(() => {
    const intervalHora = setInterval(() => {
      setFechaHora(format(new Date(), 'dd LLL, HH:mm', { locale: es }));
    }, 60000);
    return () => clearInterval(intervalHora);
  }, []);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx('flex relative z-20 shadow-md', props.className)}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? toolbarTheme.palette.background.paper
              : toolbarTheme.palette.background.default,
        }}
        position="static"
      >
        <Toolbar className="p-0 min-h-48 md:min-h-64">
          <div className="flex flex-1 px-16">
            {config.navbar.display && config.navbar.position === 'left' && (
              <>
                <Hidden lgDown>
                  {(config.navbar.style === 'style-3' ||
                    config.navbar.style === 'style-3-dense') && (
                      <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                    )}
                  {config.navbar.style === 'style-1' && !navbar.open && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}
                </Hidden>
                <Hidden lgUp>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
              </>
            )}
            <Hidden lgDown>
              <NavigationShortcuts />
            </Hidden>
          </div>
          <div className="flex items-center px-8 h-full overflow-x-auto">
            <div className="mr-8 mt-8 hidden md:flex">
              <Typography className="email text-13 whitespace-nowrap font-medium cursor-default" color="text.secondary">
                {fechaHora}
              </Typography>
            </div>
            <QuickPanelToggleButton />
            <FullScreenToggle />
            <NavigationSearch />
            <UserMenu />
          </div>
          {config.navbar.display && config.navbar.position === 'right' && (
            <>
              <Hidden lgDown>
                {!navbar.open && <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />}
              </Hidden>
              <Hidden lgUp>
                <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
              </Hidden>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout1);

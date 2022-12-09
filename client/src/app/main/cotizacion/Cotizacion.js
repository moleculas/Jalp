import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/redux/withReducer';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from 'app/redux/produccion';
import CotizacionHeader from './CotizacionHeader';
import CotizacionContent from './CotizacionContent';
import CotizacionSidebarContenedor from './CotizacionSidebarContenedor';
import CotizacionDialog from './dialogs/CotizacionDialog';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
  '& .FusePageSimple-content': {
    backgroundColor: theme.palette.background.default,
  },
}));

function Cotizacion(props) {
  const pageLayout = useRef(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Root
      header={<CotizacionHeader pageLayout={pageLayout} />}
      content={
        <div className="w-full">
          <CotizacionContent />
          <CotizacionDialog />
        </div>
      }
      ref={pageLayout}
      rightSidebarContent={<CotizacionSidebarContenedor />}
      rightSidebarWidth={isMobile ? 400 : 640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('produccionSeccion', reducer)(Cotizacion);

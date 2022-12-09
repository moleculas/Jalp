import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/redux/withReducer';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from 'app/redux/produccion';
import DatosHeader from './DatosHeader';
import DatosContent from './DatosContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
  '& .FusePageSimple-content': {
    backgroundColor: theme.palette.background.default,
  },
}));

function Datos(props) {
  const pageLayout = useRef(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Root
      header={<DatosHeader pageLayout={pageLayout} />}
      content={<DatosContent />}
      ref={pageLayout}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('produccionSeccion', reducer)(Datos);

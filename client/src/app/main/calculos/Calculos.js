import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/redux/withReducer';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from 'app/redux/produccion';
import CalculosHeader from './CalculosHeader';
import CalculosContent from './CalculosContent';
import CalculosSidebarContenedor from './CalculosSidebarContenedor';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
  '& .FusePageSimple-content': {
    backgroundColor: theme.palette.background.default,
  },
}));

function Calculos(props) {
  const pageLayout = useRef(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Root
      header={<CalculosHeader pageLayout={pageLayout} />}
      content={<CalculosContent />}
      ref={pageLayout}
      rightSidebarContent={<CalculosSidebarContenedor />}
      rightSidebarWidth={isMobile ? 400 : 640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('produccionSeccion', reducer)(Calculos);

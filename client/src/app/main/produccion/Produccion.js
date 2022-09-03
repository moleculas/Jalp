import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/redux/withReducer';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from 'app/redux/produccion';
import ProduccionHeader from './ProduccionHeader';
import ProduccionContent from './ProduccionContent';
import ProduccionSidebarContenedor from './ProduccionSidebarContenedor';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
  '& .FusePageCarded-content': {
    backgroundColor: '#f1f5f9'
  },
}));

function Produccion(props) {
  const pageLayout = useRef(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Root
      header={<ProduccionHeader pageLayout={pageLayout} />}
      content={<ProduccionContent />}
      ref={pageLayout}
      rightSidebarContent={<ProduccionSidebarContenedor />}
      rightSidebarWidth={640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('produccionSeccion', reducer)(Produccion);

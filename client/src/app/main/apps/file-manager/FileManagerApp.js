import withReducer from 'app/redux/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useParams } from 'react-router-dom';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import DetailSidebarContent from './DetailSidebarContent';
import reducer from 'app/redux/file-manager';
import FileManagerHeader from './FileManagerHeader';
import FileManagerList from './FileManagerList';
import FormFileManager from './FormFileManager';

//importación acciones
import {
  getItems,
  selectSelectedItem,
  selectSelectedButton,
  selectSelectedItemAEditar
} from 'app/redux/file-manager/itemsSlice';

function FileManagerApp() {
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectSelectedItem);
  const selectedButton = useSelector(selectSelectedButton);
  const selectedItemAEditar = useSelector(selectSelectedItemAEditar);
  const routeParams = useParams();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  //useEffect

  useEffect(() => {
    dispatch(getItems(routeParams.folderId));
  }, [dispatch, routeParams.folderId]);

  return (
    <FusePageCarded
      header={<FileManagerHeader />}
      content={<FileManagerList />}
      //rightSidebarOpen={Boolean(selectedItem) || Boolean(selectedButton)}
      rightSidebarContent={selectedItem ? (<DetailSidebarContent />) : (selectedButton || selectedItemAEditar) ? (<FormFileManager />) : null}
      rightSidebarWidth={400}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('fileManagerApp', reducer)(FileManagerApp);

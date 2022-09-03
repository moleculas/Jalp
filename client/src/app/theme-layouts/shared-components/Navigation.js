import FuseNavigation from '@fuse/core/FuseNavigation';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useEffect } from 'react';
import withReducer from 'app/redux/withReducer';
import reducer from 'app/redux/produccion';

//importacion acciones
import { selectNavigation, updateNavigationItem } from 'app/redux/fuse/navigationSlice';
import { navbarCloseMobile } from 'app/redux/fuse/navbarSlice';
import { getChatsInicio, selectDataInicioMenu } from 'app/redux/produccion/inicioSlice';

function Navigation(props) {
  const dispatch = useDispatch();
  const navigation = useSelector(selectNavigation);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const dataInicioMenu = useSelector(selectDataInicioMenu);

  //useEffect

  useEffect(() => {
    dispatch(getChatsInicio());
  }, [dispatch]);

  useEffect(() => {
    if (dataInicioMenu) {
      let objetoNavigation;
      if (dataInicioMenu.chatsPendientes.length > 0) {
        let textoChats = "";
        if (dataInicioMenu.chatsPendientes.length === 1) {
          textoChats = " chat pendiente de revisar"
        } else {
          textoChats = " chats pendientes de revisar"
        };
        objetoNavigation = {
          id: 'apps.chat',
          icon: 'heroicons-outline:chat-alt',
          title: 'Chat',
          subtitle: dataInicioMenu.chatsPendientes.length + textoChats,
          type: 'item',
          url: "/apps/chat",
          translate: 'CHAT',
          badge: {
            title: dataInicioMenu.chatsPendientes.length,
            classes: 'w-20 h-20 bg-[#4f46e5] text-white rounded-full',
          },
        };
      } else {
        objetoNavigation = {
          id: 'apps.chat',
          icon: 'heroicons-outline:chat-alt',
          title: 'Chat',
          subtitle: '',
          type: 'item',
          url: "/apps/chat",
          translate: 'CHAT',
          badge: {
            title: '',
            classes: 'w-20 h-20 bg-transparent text-white rounded-full',
          },
        };
      };
      dispatch(updateNavigationItem('apps.chat', objetoNavigation));
    };
  }, [dataInicioMenu]);

  return useMemo(() => {
    function handleItemClick(item) {
      if (isMobile) {
        dispatch(navbarCloseMobile());
      }
    };

    return (
      <FuseNavigation
        className={clsx('navigation', props.className)}
        navigation={navigation}
        layout={props.layout}
        dense={props.dense}
        active={props.active}
        onItemClick={handleItemClick}
      />
    );
  }, [dispatch, isMobile, navigation, props.active, props.className, props.dense, props.layout]);
}

Navigation.defaultProps = {
  layout: 'vertical',
};

export default withReducer('produccionSeccion', reducer)(memo(Navigation));

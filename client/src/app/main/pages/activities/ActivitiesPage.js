import withReducer from 'app/redux/withReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ActivityTimelineItem from './ActivityTimelineItem';
import reducer from 'app/redux/actividad';

//importación acciones
import { getItems, selectActividadesGestionadas } from 'app/redux/actividad/actividadSlice';
import { obtenerUsuarios } from 'app/redux/usuariosSlice';

function ActivitiesPage() {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const actividades = useSelector(selectActividadesGestionadas);

  //useEffect

  useEffect(() => {
    dispatch(obtenerUsuarios(true)).then(() => {
      dispatch(getItems());
    });
  }, [dispatch]);

  return (
    <FusePageSimple
      content={
        <div className="flex flex-col flex-auto px-24 py-40 sm:px-64 sm:pt-72 sm:pb-80">
          <Typography className="text-4xl font-extrabold tracking-tight leading-none">
            Actividad en la aplicación
          </Typography>
          <Typography className="mt-6 text-lg" color="text.secondary">
            La reciente actividad de la aplicación se enumera aquí como elementos individuales, comenzando con el más reciente.
          </Typography>
          <Timeline
            className="py-48"
            position="right"
            sx={{
              '& .MuiTimelineItem-root:before': {
                display: 'none',
              },
            }}
          >
            {actividades.map((item, index) => (
              <ActivityTimelineItem
                last={actividades.length === index + 1}
                item={item}
                key={item.id}
              />
            ))}
          </Timeline>
        </div>
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('actividadPage', reducer)(ActivitiesPage);

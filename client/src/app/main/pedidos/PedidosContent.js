import _ from '@lodash';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PedidosItem from './PedidosItem';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseNavigation from '@fuse/core/FuseNavigation';

//importación acciones
import {
  getProductosPayload
} from 'app/redux/produccion/productoSlice';
import {
  setPedidosMenu,
  getPedidosMenu,
  selectPedidosMenu,
  selectSemanaSeleccionadaMenu,
  setSemanaSeleccionadaMenu,
  setActualizadoPedido,
  selectActualizandoPedido
} from 'src/app/redux/produccion/pedidoSlice';
import {
  decMesActual,
  calculoSemanaAnyoActual,
} from 'app/logica/produccion/logicaProduccion';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-sidebarContent': {
    backgroundColor: theme.palette.background.default,
    overflowX: "hidden"
  },
}));

function PedidosContent(props) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [proveedores, setProveedores] = useState(null);
  const [proveedor, setProveedor] = useState(null);
  const [navigationData, setNavigationData] = useState(null);
  const datosPedidosMenu = useSelector(selectPedidosMenu);
  const semanaSeleccionadaMenu = useSelector(selectSemanaSeleccionadaMenu);
  const { anyo } = dispatch(decMesActual());
  const [semanaActual, setSemanaActual] = useState(dispatch(calculoSemanaAnyoActual()));
  const actualizandoPedido = useSelector(selectActualizandoPedido);

  //useEffect

  useEffect(() => {
    dispatch(setPedidosMenu(null));
    dispatch(setSemanaSeleccionadaMenu(null))
    dispatch(getProductosPayload({ familia: 'proveedores', min: true })).then(({ payload }) => {
      setProveedores(payload);
      setProveedor({ _id: payload[0]._id, codigo: payload[0].codigo });
      dispatch(getPedidosMenu({ semana: semanaActual, anyo }));
    });
  }, []);

  useEffect(() => {
    if (datosPedidosMenu) {
      const arrNav = [];
      proveedores?.map((prov, index) => {
        let elementCount = 0;
        const indiceObj = datosPedidosMenu.findIndex(pedido => pedido.proveedor === prov._id);
        indiceObj >= 0 && (elementCount = datosPedidosMenu[indiceObj].linea.length);
        let objNav = {
          id: prov._id,
          title: _.capitalize(prov.codigo),
          subtitle: `Semana: ${semanaSeleccionadaMenu ? semanaSeleccionadaMenu : semanaActual}`,
          type: index === 0 ? 'item' : 'link',
          icon: 'material-outline:open_in_browser',
          active: index === 0 ? true : false,
          badge: {
            title: elementCount,
            classes: elementCount > 0 ? 'w-20 h-20 bg-teal-400 text-white rounded-full' : 'w-20 h-20 bg-red-200 text-white rounded-full',
          },
        };
        arrNav.push(objNav);
      });
      setNavigationData(arrNav);
    };
  }, [datosPedidosMenu]);

  //actualización estado menú

  useEffect(() => {
    if (semanaSeleccionadaMenu) {
      dispatch(getPedidosMenu({ semana: semanaSeleccionadaMenu, anyo }));
    };
  }, [semanaSeleccionadaMenu]);

  useEffect(() => {
    if (actualizandoPedido) {
      dispatch(getPedidosMenu({
        semana: semanaSeleccionadaMenu ? semanaSeleccionadaMenu : semanaActual,
        anyo
      }));
      dispatch(setActualizadoPedido(false));
    };
  }, [actualizandoPedido]);

  //funciones

  const handleItemClick = (event) => {
    let objNav;
    const arrNav = [];
    navigationData.map((prov) => {
      objNav = {
        ...prov,
        type: prov.id === event.id ? 'item' : 'link',
        active: prov.id === event.id ? true : false
      };
      arrNav.push(objNav);
    });
    setNavigationData(arrNav);
    const codigo = proveedores[proveedores.findIndex(prov => prov._id === event.id)].codigo;
    setProveedor({ _id: event.id, codigo });
  };

  const RetornaSidebarLeft = () => {
    return (
      <div className="py-36 w-[200px] min-w-[200px]">
        <div className="pl-36 pb-24 text-2xl font-extrabold tracking-tight leading-tight">Proveedores</div>
        <FuseNavigation
          onItemClick={(event) => handleItemClick(event)}
          navigation={navigationData}
          className="pl-10 pr-8"
        />
      </div>
    );
  };

  if (!proveedores && !proveedor) {
    return null
  };

  return (
    (proveedores && proveedor) && (
      <Root
        content={
          <PedidosItem
            proveedor={proveedor}
            leftSidebarToggle={(ev) => {
              setLeftSidebarOpen(!leftSidebarOpen);
            }}
          />}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarOnClose={() => {
          setLeftSidebarOpen(false);
        }}
        leftSidebarContent={(datosPedidosMenu && navigationData) && (<RetornaSidebarLeft />)}
        leftSidebarWidth={200}
        scroll={isMobile ? 'normal' : 'content'}
      />
    )
  )
}

export default PedidosContent;

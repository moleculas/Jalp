import { combineReducers } from '@reduxjs/toolkit';
import inicio from './inicioSlice';
import produccion from './produccionSlice';
import escandallo from './escandalloSlice';
import objetivos from './objetivosSlice';
import pedido from './pedidoSlice';
import cotizacion from './cotizacionSlice';

const reducer = combineReducers({
  inicio,
  produccion,
  escandallo,
  objetivos,
  pedido,
  cotizacion
});

export default reducer;

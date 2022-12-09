import { combineReducers } from '@reduxjs/toolkit';
import inicio from './inicioSlice';
import produccion from './produccionSlice';
import escandallo from './escandalloSlice';
import objetivos from './objetivosSlice';
import pedido from './pedidoSlice';
import cotizacion from './cotizacionSlice';
import producto from './productoSlice';

const reducer = combineReducers({
  inicio,
  produccion,
  escandallo,
  objetivos,
  pedido,
  cotizacion,
  producto
});

export default reducer;

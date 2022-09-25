import { combineReducers } from '@reduxjs/toolkit';
import inicio from './inicioSlice';
import produccion from './produccionSlice';
import escandallo from './escandalloSlice';
import objetivos from './objetivosSlice';
import pedido from './pedidoSlice';

const reducer = combineReducers({
  inicio,
  produccion,
  escandallo,
  objetivos,
  pedido
});

export default reducer;

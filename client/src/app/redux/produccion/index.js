import { combineReducers } from '@reduxjs/toolkit';
import inicio from './inicioSlice';
import produccion from './produccionSlice';
import escandallo from './escandalloSlice';
import objetivos from './objetivosSlice';

const reducer = combineReducers({
  inicio,
  produccion,
  escandallo,
  objetivos
});

export default reducer;

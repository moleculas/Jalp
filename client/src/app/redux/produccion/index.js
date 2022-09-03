import { combineReducers } from '@reduxjs/toolkit';
import inicio from './inicioSlice';
import produccion from './produccionSlice';

const reducer = combineReducers({
  inicio,
  produccion
});

export default reducer;

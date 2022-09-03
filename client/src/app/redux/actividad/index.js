import { combineReducers } from '@reduxjs/toolkit';
import actividad from './actividadSlice';

const reducer = combineReducers({
  actividad,
});

export default reducer;

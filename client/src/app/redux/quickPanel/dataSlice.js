import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const getNotes = createAsyncThunk(
  'quickPanel/data/getNotes',
  async (_, { getState, dispatch }) => {
    const user = getState().user;
    try {
      const response = await axios.get('/notes/dia/' + user.data.id);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const getEvents = createAsyncThunk(
  'quickPanel/data/getEvents',
  async (_, { getState, dispatch }) => {
    const user = getState().user;
    try {
      const response = await axios.get('/calendar/events/dia/' + user.data.id);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const getTasks = createAsyncThunk(
  'quickPanel/data/getTasks',
  async (_, { getState, dispatch }) => {
    const user = getState().user;
    try {
      const response = await axios.get('/tasks/dia/' + user.data.id);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const initialState = {
  notes: [],
  events: [],
  tasks: []
};

const dataSlice = createSlice({
  name: 'quickPanel/data',
  initialState,
  reducers: {},
  extraReducers: {
    [getNotes.fulfilled]: (state, action) => {
      state.notes = action.payload;
    },
    [getEvents.fulfilled]: (state, action) => {
      state.events = action.payload;
    },
    [getTasks.fulfilled]: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const selectQuickPanelDataNotes = ({ quickPanel }) => quickPanel.data.notes;
export const selectQuickPanelDataEvents = ({ quickPanel }) => quickPanel.data.events;
export const selectQuickPanelDataTasks = ({ quickPanel }) => quickPanel.data.tasks;

export default dataSlice.reducer;

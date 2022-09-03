import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getTags = createAsyncThunk(
  'tasksApp/tags/getTags', 
  async (params, { getState }) => {
    try {
      const response = await axios.get('/tasks/tags');
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };  
});

const tagsAdapter = createEntityAdapter({});

export const { selectAll: selectTags, selectById: selectTagsById } = tagsAdapter.getSelectors(
  (state) => state.tasksApp.tags
);

const tagsSlice = createSlice({
  name: 'tasksApp/tags',
  initialState: tagsAdapter.getInitialState([]),
  reducers: {},
  extraReducers: {
    [getTags.fulfilled]: tagsAdapter.setAll,
  },
});

export default tagsSlice.reducer;

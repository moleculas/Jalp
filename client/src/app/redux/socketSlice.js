import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    objSocket: null
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.objSocket = action.payload;
        },
    },   
});

export const {
    setSocket
} = socketSlice.actions;

export const selectObjSocket = ({ socket }) => socket.objSocket;

export default socketSlice.reducer;

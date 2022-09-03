import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  panelActivo: false,
  panelFormActivo: false,
  panelPassActivo: false
};

const userPanelSlice = createSlice({
  name: 'userPanelSlice',
  initialState,
  reducers: {
    toggleUserPanel(state, action) {
      state.panelActivo = !state.panelActivo
    },
    openUserPanel(state, action) {
      state.panelActivo = true
    },
    closeUserPanel(state, action) {
      state.panelActivo = false
    },
    setPanelFormActivo(state, action) {
      state.panelFormActivo = action.payload
    },
    setPanelPassActivo(state, action) {
      state.panelPassActivo = action.payload
    },
  },
});

export const {
  toggleUserPanel,
  openUserPanel,
  closeUserPanel,
  setPanelFormActivo,
  setPanelPassActivo,
} = userPanelSlice.actions;

export default userPanelSlice.reducer;

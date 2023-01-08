import { createSlice } from '@reduxjs/toolkit';

const initialState = {    
    dialogPdfId: null,   
};

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    openDialogPdf: (state, action) => { 
        state.dialogPdfId = action.payload;
    },
    closeDialogPdf: (state, action) => {
        state.dialogPdfId = action.null;
    },
  },
});

export const { openDialogPdf, closeDialogPdf } = pdfSlice.actions;

export const selectDialogPdfId = ({ fuse }) => fuse.pdf.dialogPdfId;

export default pdfSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inspectionData: [
    {
      id: 1,
      name: 'Inspection 1',
      totalPhoto: '112',
      inspectedPhoto: '21/112',
      date: '2024/1/3',
    },
    {
      id: 2,
      name: 'Inspection 2',
      totalPhoto: '116',
      inspectedPhoto: '42/116',
      Date: '2024/2/8',
    },
    {
      id: 3,
      name: 'Inspection 3',
      TotalPhoto: '189',
      InspectedPhoto: '3/189',
      Date: '2024/1/12',
    },
  ],
};
export const Inspection = createSlice({
  name: 'Inspection',
  initialState,
  reducers: {
    setInspectionData: () => {
      state.inspectionData = action.payload;
    },
  },
});
export const { setInspectionData } = Inspection.actions;
export default Inspection.reducer;

// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['segment'] = {
  error: null,
  segment: []
};

const slice = createSlice({
  name: 'segment',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET CATEGORY
    getSegmentSuccess(state, action) {
      state.segment = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getSegment() {
  return async () => {
    try {
      const response = await axios.get('/api/segment');
      console.log(response);
      dispatch(slice.actions.getSegmentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

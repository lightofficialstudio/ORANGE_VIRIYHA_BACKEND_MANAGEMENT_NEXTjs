// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['criteria'] = {
  error: null,
  criteria: []
};

const slice = createSlice({
  name: 'criteria',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET CATEGORY
    getCriteriaSuccess(state, action) {
      state.criteria = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCriteria() {
  return async () => {
    try {
      const response = await axios.get('/api/criteria');
      console.log(response);
      dispatch(slice.actions.getCriteriaSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

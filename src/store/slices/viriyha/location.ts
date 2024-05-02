// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['location_transaction'] = {
  error: null,
  location_transaction: []
};

const slice = createSlice({
  name: 'location_transaction',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET
    getLocationTransactionSuccess(state, action) {
      state.location_transaction = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getLocationTransaction() {
  return async () => {
    try {
      const response = await axios.get('/api/location_transaction');
      console.log(response);
      dispatch(slice.actions.getLocationTransactionSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

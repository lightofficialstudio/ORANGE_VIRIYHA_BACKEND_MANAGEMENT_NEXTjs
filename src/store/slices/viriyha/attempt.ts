// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['attempt_transaction'] = {
  error: null,
  attempt_transaction: []
};

const slice = createSlice({
  name: 'attempt_transaction',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET ERROR LOG
    getAttemptTransactionSuccess(state, action) {
      state.attempt_transaction = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAttemptTransaction() {
  return async () => {
    try {
      const response = await axios.get('/api/attempt_transaction');
      console.log(response);
      dispatch(slice.actions.getAttemptTransactionSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['error_message'] = {
  error: null,
  error_message: []
};

const slice = createSlice({
  name: 'error_message',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET ERROR LOG
    getErrorScenario(state, action) {
      state.error_message = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getErrorMessage() {
  return async () => {
    try {
      const response = await axios.get('/api/error_scenario');
      console.log(response);
      dispatch(slice.actions.getErrorScenario(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

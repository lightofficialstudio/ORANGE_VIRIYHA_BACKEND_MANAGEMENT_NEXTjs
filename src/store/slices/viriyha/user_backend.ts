// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['user_backend'] = {
  error: null,
  user_backend: []
};

const slice = createSlice({
  name: 'user_backend',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET USER
    getUserBackendSuccess(state, action) {
      state.user_backend = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUserBackend() {
  return async () => {
    try {
      const response = await axios.get('/api/user_backend');
      console.log(response);
      dispatch(slice.actions.getUserBackendSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

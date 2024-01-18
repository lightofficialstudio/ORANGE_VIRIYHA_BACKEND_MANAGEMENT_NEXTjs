// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['category'] = {
  error: null,
  category: []
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET CATEGORY
    getOrdersSuccess(state, action) {
      state.category = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCategory() {
  return async () => {
    try {
      const response = await axios.get('/api/category');
      console.log(response);
      dispatch(slice.actions.getOrdersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

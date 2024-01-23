// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['shop'] = {
  error: null,
  shop: []
};

const slice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET SHOP
    getShopSuccess(state, action) {
      state.shop = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getShopList() {
  return async () => {
    try {
      const response = await axios.get('/api/shop');
      console.log(response);
      dispatch(slice.actions.getShopSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

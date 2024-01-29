// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['branch'] = {
  error: null,
  branch: []
};

const slice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET SHOP
    getBrranchSuccess(state, action) {
      state.branch = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getBranchFromShopBy(id: string | number | undefined) {
  return async () => {
    try {
      const response = await axios.get(`api/shop/` + id + `/branch`);
      console.log(response);
      dispatch(slice.actions.getBrranchSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

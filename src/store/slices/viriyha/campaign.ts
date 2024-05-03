// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['campaign'] = {
  error: null,
  campaign: []
};

const slice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET CAMPAIGN
    getCampaignSuccess(state, action) {
      state.campaign = action.payload;
    },

    // GET CAMPAIGN ALL
    getCampaignAllSuccess(state, action) {
      state.campaign = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCampaignList() {
  return async () => {
    try {
      const response = await axios.get('/api/campaign/normal');
      console.log(response);
      dispatch(slice.actions.getCampaignSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCampaignAll() {
  return async () => {
    try {
      const response = await axios.get(`/api/campaign/normal/all`);
      dispatch(slice.actions.getCampaignAllSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCampaignTransaction() {
  return async () => {
    try {
      const response = await axios.get('/api/campaign/transaction');
      if (response.data.Campaign_Code != null) {
      }
      dispatch(slice.actions.getCampaignSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

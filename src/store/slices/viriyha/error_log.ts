// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../../utils/axios';
import { dispatch } from '../../index';

// types
import { DefaultRootStateProps } from '../../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['error_log'] = {
    error: null,
    error_log: []
};

const slice = createSlice({
    name: 'error_logs',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET ERROR LOG
        getErrorLogSuccess(state, action) {
            state.error_log = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getErrorLog() {
    return async () => {
        try {
            const response = await axios.get('/api/error_log');
            console.log(response);
            dispatch(slice.actions.getErrorLogSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

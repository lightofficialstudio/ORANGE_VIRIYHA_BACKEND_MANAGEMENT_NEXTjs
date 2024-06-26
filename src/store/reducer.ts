// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import menuReducer from './slices/menu';
// viriyha imports
import categoryReducer from './slices/viriyha/category';
import shopReducer from './slices/viriyha/shop';
import bannerReducer from './slices/viriyha/banner';
import user_backendReducer from './slices/viriyha/user_backend';
import branchReducer from './slices/viriyha/branch';
import segmentReducer from './slices/viriyha/segment';
import criteriaReducer from './slices/viriyha/criteria';
import errorLogReducer from './slices/viriyha/error_log';
import campaignReducer from './slices/viriyha/campaign';
import specialCampaignReducer from './slices/viriyha/campaign_special';
import errorScenarioReducter from './slices/viriyha/error_message';
import locationTransactionReducer from './slices/viriyha/location';
import attemptTransactionReducer from './slices/viriyha/attempt';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  snackbar: snackbarReducer,
  cart: persistReducer(
    {
      key: 'cart',
      storage,
      keyPrefix: 'berry-'
    },
    cartReducer
  ),
  kanban: kanbanReducer,
  customer: customerReducer,
  contact: contactReducer,
  product: productReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  mail: mailReducer,
  user: userReducer,
  menu: menuReducer,
  // viriyha
  category: categoryReducer,
  shop: shopReducer,
  banner: bannerReducer,
  user_backend: user_backendReducer,
  branch: branchReducer,
  segment: segmentReducer,
  criteria: criteriaReducer,
  errorLog: errorLogReducer,
  campaign: campaignReducer,
  special_campaign: specialCampaignReducer,
  error_message: errorScenarioReducter,
  location_transaction: locationTransactionReducer,
  attempt_transaction: attemptTransactionReducer
});

export default reducer;

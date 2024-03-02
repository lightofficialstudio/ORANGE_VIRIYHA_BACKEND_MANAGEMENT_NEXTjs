import application from './application';
import forms from './forms';
import elements from './elements';
import samplePage from './sample-page';
import pages from './pages';
import utilities from './utilities';
import support from './support';
import other from './other';
import { NavItemType } from 'types';
// viriyha menu
import dashboard from './dashboard';
import admin from './admin';
import campaign from './campaign';
import report from './report';
import logs from './logs';
import config from './config';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, admin, campaign, report, config, logs, application, forms, elements, samplePage, pages, utilities, support, other]
  // items: [admin, campaign, report, dashboard, logs]
};

export default menuItems;

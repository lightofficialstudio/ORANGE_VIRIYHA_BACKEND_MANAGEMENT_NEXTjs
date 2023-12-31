import dashboard from './dashboard';
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
import admin from './admin'
import campaign from './campaign';
import report from './report';
import logs from './logs';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [admin , campaign , report ,dashboard, logs ,application, forms, elements, samplePage, pages, utilities, support, other  ]
};

export default menuItems;

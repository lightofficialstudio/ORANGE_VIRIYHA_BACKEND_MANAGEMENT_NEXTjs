import dashboard from './dashboard';
import application from './application';
import forms from './forms';
import elements from './elements';
import samplePage from './sample-page';
import pages from './pages';
import utilities from './utilities';
import support from './support';
import other from './other';
import admin from './admin'
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [admin ,dashboard, application, forms, elements, samplePage, pages, utilities, support, other  ]
};

export default menuItems;

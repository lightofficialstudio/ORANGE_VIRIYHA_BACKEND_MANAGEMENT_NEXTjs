// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconDashboard: IconDashboard,
  IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="dashboard" />,
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'web_analytics_dashboard',
      title: <FormattedMessage id="Web Analytics Dashboard" />,
      type: 'item',
      url: '/dashboard/web-analytics',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'campaign_analytics_dashboard',
      title: <FormattedMessage id="Campaign Dashboard" />,
      type: 'item',
      url: '/dashboard/campaign-analytics',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
    // {
    //   id: 'default',
    //   title: <FormattedMessage id="default" />,
    //   type: 'item',
    //   url: '/dashboard/default',
    //   icon: icons.IconDashboard,
    //   breadcrumbs: false
    // }

    // {
    //   id: 'analytics',
    //   title: <FormattedMessage id="analytics" />,
    //   type: 'item',
    //   url: '/dashboard/analytics',
    //   icon: icons.IconDeviceAnalytics,
    //   breadcrumbs: false
    // }
  ]
};

export default dashboard;

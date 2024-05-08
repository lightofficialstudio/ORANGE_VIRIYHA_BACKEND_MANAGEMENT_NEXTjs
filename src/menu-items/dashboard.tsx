// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconChartArcs3, IconGraph } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconDashboard: IconDashboard,
  IconDeviceAnalytics: IconDeviceAnalytics,
  IconChartArcs3: IconChartArcs3,
  IconGraph: IconGraph
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="Dashboard&Report" />,
  caption: <FormattedMessage id="แดชบอร์ดและรายงาน" />,
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'Web_Anylytics',
      title: <FormattedMessage id="Web Analytics" />,
      caption: <FormattedMessage id="ระบบรายงานเว็บไซต์" />,
      type: 'collapse',
      icon: icons.IconGraph,
      requiredPermission: 'MenuWebAnalytics',
      children: [
        {
          id: 'web_analytics_dashboard',
          title: <FormattedMessage id="Dashboard" />,
          type: 'item',
          url: '/dashboard/web-analytics',
          breadcrumbs: false,
          requiredPermission: 'MenuWebAnalytics'
        },
        {
          id: 'report_website',
          title: <FormattedMessage id="Report" />,
          type: 'item',
          url: '/report/website',
          breadcrumbs: false,
          requiredPermission: 'MenuWebAnalytics'
        }
      ]
    },
    {
      id: 'Redeem_Transaction',
      title: <FormattedMessage id="Redeem Transaction" />,
      caption: <FormattedMessage id="ระบบรายงานการรับสิทธิ์" />,
      type: 'collapse',
      icon: icons.IconGraph,
      requiredPermission: 'MenuDashboardRedeem',

      children: [
        {
          id: 'redeem_transaction_dasboard',
          title: <FormattedMessage id="Dashboard" />,
          type: 'item',
          url: '/dashboard/redeem-transaction',
          breadcrumbs: false,
          requiredPermission: 'MenuDashboardRedeem'
        },
        {
          id: 'report_redeem',
          title: <FormattedMessage id="Report" />,
          type: 'item',
          url: '/report/redeem',
          breadcrumbs: false,
          requiredPermission: 'MenuDashboardRedeem'
        }
      ]
    },
    {
      id: 'Location_Analytics',
      title: <FormattedMessage id="Location Analytics" />,
      caption: <FormattedMessage id="ระบบรายงานสถานที่รับสิทธิ์" />,
      type: 'item',
      icon: icons.IconGraph,
      breadcrumbs: false,
      url: '/dashboard/location-analytics',
      requiredPermission: 'MenuDashboardCampaign'
    }
  ]
};

export default dashboard;

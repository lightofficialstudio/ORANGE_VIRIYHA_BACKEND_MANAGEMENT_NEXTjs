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
  title: <FormattedMessage id="dashboard" />,
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'web_analytics_dashboard',
      title: <FormattedMessage id="Web Analytics" />,
      type: 'item',
      url: '/dashboard/web-analytics',
      icon: icons.IconChartArcs3,
      breadcrumbs: false
    },
    {
      id: 'campaign_analytics_dashboard',
      title: <FormattedMessage id="Campaign" />,
      type: 'item',
      url: '/dashboard/campaign-analytics',
      icon: icons.IconGraph,
      breadcrumbs: false
    },
    {
      id: 'redeem_transaction_dasboard',
      title: <FormattedMessage id="Redeem" />,
      type: 'item',
      url: '/dashboard/redeem-transaction',
      icon: icons.IconChartArcs3,
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

// สมมติฐาน: รายการสิทธิ์ของผู้ใช้
const userPermissions = ['redeem_transaction_dasboard', 'web_analytics_dashboard', 'campaign_analytics_dashboard'];

// ฟังก์ชันสำหรับตรวจสอบว่าผู้ใช้มีสิทธิ์ตามที่ต้องการหรือไม่
const hasPermission = (itemId: any) => userPermissions.includes(itemId);

// กรองรายการเมนูตามสิทธิ์ของผู้ใช้
const filteredChildren = dashboard.children?.filter((child) => hasPermission(child.id));

// สร้าง object ใหม่สำหรับ dashboard ที่ได้กรองแล้ว
const filteredDashboard = { ...dashboard, children: filteredChildren };

export default filteredDashboard;

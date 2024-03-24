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
      children: [
        {
          id: 'web_analytics_dashboard',
          title: <FormattedMessage id="Dashboard" />,
          type: 'item',
          url: '/dashboard/web-analytics',
          breadcrumbs: false
        },
        {
          id: 'report_website',
          title: <FormattedMessage id="Report" />,
          type: 'item',
          url: '/report/website',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'Redeem_Transaction',
      title: <FormattedMessage id="Redeem Transaction" />,
      caption: <FormattedMessage id="ระบบรายงานการรับสิทธิ์" />,
      type: 'collapse',
      icon: icons.IconGraph,
      children: [
        {
          id: 'redeem_transaction_dasboard',
          title: <FormattedMessage id="Dashboard" />,
          type: 'item',
          url: '/dashboard/redeem-transaction',
          breadcrumbs: false
        },
        {
          id: 'report_redeem',
          title: <FormattedMessage id="Report" />,
          type: 'item',
          url: '/report/redeem',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'Campaign_Analytics',
      title: <FormattedMessage id="Campaign Analytics" />,
      caption: <FormattedMessage id="ระบบรายงานสิทธิพิเศษ" />,
      type: 'collapse',
      icon: icons.IconGraph,
      children: [
        {
          id: 'campaign_analytics_dashboard',
          title: <FormattedMessage id="Dashboard" />,
          type: 'item',
          url: '/dashboard/campaign-analytics',
          breadcrumbs: false
        }
      ]
    }
  ]
};

// สมมติฐาน: รายการสิทธิ์ของผู้ใช้
const userPermissions = ['Campaign_Analytics', 'Redeem_Transaction', 'Web_Anylytics'];

// ฟังก์ชันสำหรับตรวจสอบว่าผู้ใช้มีสิทธิ์ตามที่ต้องการหรือไม่
const hasPermission = (itemId: any) => userPermissions.includes(itemId);

// กรองรายการเมนูตามสิทธิ์ของผู้ใช้
const filteredChildren = dashboard.children?.filter((child) => hasPermission(child.id));

// สร้าง object ใหม่สำหรับ dashboard ที่ได้กรองแล้ว
const filteredDashboard = { ...dashboard, children: filteredChildren };

export default filteredDashboard;

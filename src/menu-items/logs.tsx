// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandTabler } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconBrandTabler: IconBrandTabler
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const logs: NavItemType = {
  id: 'logs',
  title: <FormattedMessage id="Logs" />,
  caption: <FormattedMessage id="ข้อความระบบ" />,
  icon: icons.IconBrandTabler,
  type: 'group',
  requiredPermission: 'MenuAdminBanner',
  children: [
    {
      id: 'errpr_logs',
      title: <FormattedMessage id="Error Logs" />,
      caption: <FormattedMessage id="การแจ้งเตือนข้อความระบบ" />,
      type: 'item',
      url: '/logs/error',
      icon: icons.IconBrandTabler,
      breadcrumbs: false,
      requiredPermission: 'MenuLogsErrorLogs'
    }
  ]
};

export default logs;

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconMessage } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconMessage: IconMessage
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const logs: NavItemType = {
  id: 'config',
  title: <FormattedMessage id="Config" />,
  caption: <FormattedMessage id="ปรับแต่งระบบ" />,

  icon: icons.IconMessage,
  type: 'group',
  children: [
    {
      id: 'config_error',
      title: <FormattedMessage id="Error Message" />,
      caption: <FormattedMessage id="ปรับปรุงข้อความล้มเหลว" />,
      type: 'item',
      url: '/config/error',
      icon: icons.IconMessage,
      breadcrumbs: false
    }
  ]
};

export default logs;

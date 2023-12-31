// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandTabler,  } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
    IconBrandTabler: IconBrandTabler,
   
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const logs: NavItemType = {
  id: 'logs',
  title: <FormattedMessage id="Logs" />,
  icon: icons.IconBrandTabler,
  type: 'group',
  children: [
    {
      id: 'errpr_logs',
      title: <FormattedMessage id="Error Logs" />,
      type: 'item',
      url: '/logs/error',
      icon: icons.IconBrandTabler,
      breadcrumbs: false
    },
    
   
  ]
};

export default logs;

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconPhoto, IconFocus2, IconLocation, IconLayersIntersect, IconBrowser } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconPhoto: IconPhoto,
  IconFocus2: IconFocus2,
  IconLocation: IconLocation,
  IconLayersIntersect: IconLayersIntersect,
  IconBrowser: IconBrowser
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const report: NavItemType = {
  id: 'report',
  title: <FormattedMessage id="Report" />,
  icon: icons.IconPhoto,
  type: 'group',
  children: [
    {
      id: 'report_attempt',
      title: <FormattedMessage id="Attempt" />,
      type: 'item',
      url: '/report/attempt',
      icon: icons.IconFocus2,
      breadcrumbs: false
    },
    {
      id: 'report_location',
      title: <FormattedMessage id="Location" />,
      type: 'item',
      url: '/report/location',
      icon: icons.IconLocation,
      breadcrumbs: false
    },
    {
      id: 'report_redeem',
      title: <FormattedMessage id="Redeem Transaction" />,
      type: 'item',
      url: '/report/attempt',
      icon: icons.IconLayersIntersect,
      breadcrumbs: false
    },
    {
      id: 'report_website',
      title: <FormattedMessage id="Website Analyze" />,
      type: 'item',
      url: '/report/website',
      icon: icons.IconBrowser,
      breadcrumbs: false
    }
  ]
};

export default report;

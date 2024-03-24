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
  title: <FormattedMessage id="Transaction" />,
  caption: <FormattedMessage id="ประวัติทำรายการ" />,

  icon: icons.IconPhoto,
  type: 'group',
  children: [
    {
      id: 'report_attempt',
      title: <FormattedMessage id="Attempt" />,
      caption: <FormattedMessage id="ประวัติการพยายามเข้ารับสิทธิ์" />,

      type: 'item',
      url: '/report/attempt',
      icon: icons.IconFocus2,
      breadcrumbs: false
    },
    {
      id: 'report_location',
      title: <FormattedMessage id="Location" />,
      caption: <FormattedMessage id="ประวัติที่อยู่การกดรับสิทธิ์" />,
      type: 'item',
      url: '/report/location',
      icon: icons.IconLocation,
      breadcrumbs: false
    }
  ]
};

export default report;

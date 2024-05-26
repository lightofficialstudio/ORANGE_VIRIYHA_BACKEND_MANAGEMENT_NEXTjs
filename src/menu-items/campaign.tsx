// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSquarePlus, IconBrandCampaignmonitor } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconSquarePlus: IconSquarePlus,
  IconBrandCampaignmonitor: IconBrandCampaignmonitor
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const campaign: NavItemType = {
  id: 'campaign',
  title: <FormattedMessage id="Campaign Management" />,
  caption: <FormattedMessage id="สร้างแคมเปญ" />,
  icon: icons.IconSquarePlus,
  type: 'group',
  requiredPermission: 'MenuAdminBanner',
  children: [
    {
      id: 'normal_campaign',
      title: <FormattedMessage id="Normal Campaign" />,
      type: 'item',
      url: '/campaign/normal',
      caption: <FormattedMessage id="สร้างแคมเปญทั่วไป" />,
      icon: icons.IconBrandCampaignmonitor,
      breadcrumbs: false,
      requiredPermission: 'MenuCampaignNormal'
    },
    {
      id: 'special_campaign',
      title: <FormattedMessage id="Special Campaign" />,
      caption: <FormattedMessage id="สร้างแคมเปญรูปแบบพิเศษ" />,
      type: 'item',
      url: '/campaign/special',
      icon: icons.IconBrandCampaignmonitor,
      breadcrumbs: false,
      requiredPermission: 'MenuCampaignSpecial'
    }
  ]
};

export default campaign;

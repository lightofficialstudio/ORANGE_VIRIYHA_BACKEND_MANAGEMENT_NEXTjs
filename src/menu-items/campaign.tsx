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
  title: <FormattedMessage id="Campaign" />,
  icon: icons.IconSquarePlus,
  type: 'group',
  children: [
    {
      id: 'normal_campaign',
      title: <FormattedMessage id="Normal Campaign" />,
      type: 'item',
      url: '/campaign/normal',
      icon: icons.IconBrandCampaignmonitor,
      breadcrumbs: false
    },
    {
      id: 'special_campaign',
      title: <FormattedMessage id="Special Campaign" />,
      type: 'item',
      url: '/campaign/special',
      icon: icons.IconBrandCampaignmonitor,
      breadcrumbs: false
    }
  ]
};

export default campaign;

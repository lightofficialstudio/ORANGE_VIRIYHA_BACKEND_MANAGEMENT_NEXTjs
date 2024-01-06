// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconPhoto, IconCategory, IconBuildingStore, IconUser } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconPhoto: IconPhoto,
  IconCategory: IconCategory,
  IconBuildingStore: IconBuildingStore,
  IconUser: IconUser
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const admin: NavItemType = {
  id: 'admin',
  title: <FormattedMessage id="Admin" />,
  icon: icons.IconPhoto,
  type: 'group',
  children: [
    {
      id: 'banner_management',
      title: <FormattedMessage id="Banner Management" />,
      type: 'item',
      url: '/admin/banners',
      icon: icons.IconPhoto,
      breadcrumbs: false
    },
    {
      id: 'category_management',
      title: <FormattedMessage id="Category Management" />,
      type: 'item',
      url: '/admin/category',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
    {
      id: 'shop_management',
      title: <FormattedMessage id="Shop Management" />,
      type: 'item',
      url: '/admin/shop',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'user_management',
      title: <FormattedMessage id="User Management" />,
      icon: icons.IconUser,
      type: 'collapse',
      children: [
        {
          id: 'user_frontend',
          title: <FormattedMessage id="Frontend Users" />,
          type: 'item',
          url: '/admin/users/frontend',
          external: true,
          target: true,
          breadcrumbs: false
        },
        {
          id: 'user_frontend',
          title: <FormattedMessage id="Backend Users" />,
          type: 'item',
          url: '/admin/users/backend',
          external: true,
          target: true,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default admin;

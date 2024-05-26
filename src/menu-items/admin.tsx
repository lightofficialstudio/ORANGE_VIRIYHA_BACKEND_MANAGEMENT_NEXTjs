// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconPhoto, IconCategory, IconBuildingStore, IconUser, IconAdjustments, IconVectorTriangle } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
  IconPhoto: IconPhoto,
  IconCategory: IconCategory,
  IconBuildingStore: IconBuildingStore,
  IconUser: IconUser,
  IconAdjustments: IconAdjustments,
  IconVectorTriangle: IconVectorTriangle
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const admin: NavItemType = {
  id: 'admin',
  title: <FormattedMessage id="Admin Management" />,
  caption: <FormattedMessage id="ระบบจัดการแอดมิน" />,

  icon: icons.IconPhoto,
  type: 'group',
  children: [
    {
      id: 'banner_management',
      title: <FormattedMessage id="Banner Management" />,
      caption: <FormattedMessage id="จัดการแบนเนอร์" />,
      type: 'item',
      url: '/admin/banners',
      icon: icons.IconPhoto,
      breadcrumbs: false,
      requiredPermission: 'MenuAdminBanner'
    },
    {
      id: 'category_management',
      title: <FormattedMessage id="Category Management" />,
      caption: <FormattedMessage id="จัดการหมวดหมู่" />,
      type: 'item',
      url: '/admin/category',
      icon: icons.IconCategory,
      breadcrumbs: false,
      requiredPermission: 'MenuAdminCategory'
    },
    {
      id: 'shop_management',
      title: <FormattedMessage id="Brand Management" />,
      caption: <FormattedMessage id="สร้างแบรนด์" />,
      type: 'item',
      url: '/admin/shop',
      icon: icons.IconBuildingStore,
      breadcrumbs: false,
      requiredPermission: 'MenuAdminShop'
    },
    {
      id: 'segment_management',
      title: <FormattedMessage id="Segment" />,
      caption: <FormattedMessage id="กำหนดกลุ่มลูกค้า" />,
      type: 'item',
      url: '/admin/segment',
      icon: icons.IconAdjustments,
      breadcrumbs: false,
      requiredPermission: 'MenuAdminSegment'
    },
    {
      id: 'criteria_management',
      title: <FormattedMessage id="Criteria" />,
      caption: <FormattedMessage id="กำหนดกลุ่มผลิตภัณฑ์" />,
      type: 'item',
      url: '/admin/criteria',
      icon: icons.IconVectorTriangle,
      breadcrumbs: false,
      requiredPermission: 'MenuAdminCriteria'
    },
    {
      id: 'user_management',
      title: <FormattedMessage id="User Management" />,
      caption: <FormattedMessage id="ระบบจัดการผู้ใช้งาน" />,
      icon: icons.IconUser,
      breadcrumbs: false,
      type: 'item',
      url: '/admin/users/backend',
      requiredPermission: 'MenuAdminBackendUsers'
    }
  ]
};

export default admin;

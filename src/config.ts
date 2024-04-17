import { LAYOUT_CONST } from 'constant';

// types
import { ConfigProps } from 'types/config';

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = '/dashboard/web-analytics';
export const HORIZONTAL_MAX_ITEM = 7;

const config: ConfigProps = {
  layout: LAYOUT_CONST.VERTICAL_LAYOUT,
  drawerType: LAYOUT_CONST.DEFAULT_DRAWER,
  fontFamily: 'LineSeedTH', // เปลี่ยนเป็น 'LineSeedTH'
  borderRadius: 9,
  outlinedFilled: true,
  navType: 'light',
  presetColor: 'theme6',
  locale: 'en',
  rtlLayout: false,
  container: false
};

export default config;

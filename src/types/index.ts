import React, { FunctionComponent, ReactElement, ReactNode } from 'react';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

// material-ui
import { SvgIconTypeMap, ChipProps, TableCellProps } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// project imports
import { UserProfile } from 'types/user-profile';
import { TablerIcon } from '@tabler/icons';
import { CartStateProps } from './cart';
import { KanbanStateProps } from './kanban';
import { CustomerStateProps } from './customer';
import { ContactStateProps } from './contact';
import { ProductStateProps } from './product';
import { ChatStateProps } from './chat';
import { CalendarStateProps } from './calendar';
import { MailStateProps } from './mail';
import { UserStateProps } from './user';
import { SnackbarProps } from './snackbar';
// viriyha type
import { CategoryStateProps } from './viriyha_type/category';
import { ShopStateProps } from './viriyha_type/shop';
import { BannerStateProps } from './viriyha_type/banner';
import { UserBackendStateProps } from './viriyha_type/backend_user';
import { BranchStateProps } from './viriyha_type/branch';
import { SegmentStateProps } from './viriyha_type/segment';
import { CriteriaStateProps } from './viriyha_type/criteria';
import { ErrorLogStateProps } from './viriyha_type/error_logs';
import { ErrorMessageStateProps } from './viriyha_type/error_message';
import { CampaignStateProps } from './viriyha_type/campaign';
import { LocationTransactionStateProps } from './viriyha_type/location';
import { AttemptTransactionStateProps } from './viriyha_type/attempt';

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type DateRange = { start: number | Date; end: number | Date };

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export type Direction = 'up' | 'down' | 'right' | 'left';

export interface TabsProps {
  children?: React.ReactElement | React.ReactNode | string;
  value: string | number;
  index: number;
}

export interface GenericCardProps {
  title?: string;
  primary?: string | number | undefined;
  secondary?: string;
  content?: string;
  image?: string;
  dateTime?: string;
  iconPrimary?: OverrideIcon;
  color?: string;
  size?: string;
}

export type OverrideIcon =
  | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
      muiName: string;
    })
  | React.ComponentClass<any>
  | FunctionComponent<any>
  | TablerIcon;

export interface EnhancedTableHeadProps extends TableCellProps {
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: ArrangementOrder;
  orderBy?: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (e: React.SyntheticEvent, p: string) => void;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
}

export type HeadCell = {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding?: string | boolean | undefined;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type NavItemTypeObject = { children?: NavItemType[]; items?: NavItemType[]; type?: string };

export type NavItemType = {
  id?: string;
  icon?: GenericCardProps['iconPrimary'];
  target?: boolean;
  external?: boolean;
  url?: string | undefined;
  type?: string;
  title?: ReactNode | string;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  caption?: ReactNode | string;
  breadcrumbs?: boolean;
  disabled?: boolean;
  chip?: ChipProps;
  children?: NavItemType[];
  elements?: NavItemType[];
  search?: string;
  requiredPermission?: string;
};

export type AuthSliderProps = {
  title: string;
  description: string;
};

export interface ColorPaletteProps {
  color: string;
  label: string;
  value: string;
}

export interface DefaultRootStateProps {
  snackbar: SnackbarProps;
  cart: CartStateProps;
  kanban: KanbanStateProps;
  customer: CustomerStateProps;
  contact: ContactStateProps;
  product: ProductStateProps;
  chat: ChatStateProps;
  calendar: CalendarStateProps;
  mail: MailStateProps;
  user: UserStateProps;
  // viriyha
  category: CategoryStateProps;
  shop: ShopStateProps;
  banner: BannerStateProps;
  campaign: CampaignStateProps;
  campaign_special: CampaignStateProps;
  user_backend: UserBackendStateProps;
  branch: BranchStateProps;
  segment: SegmentStateProps;
  criteria: CriteriaStateProps;
  error_log: ErrorLogStateProps;
  error_message: ErrorMessageStateProps;
  location_transaction: LocationTransactionStateProps;
  attempt_transaction: AttemptTransactionStateProps;
}

export interface ColorProps {
  readonly [key: string]: string;
}

export type GuardProps = {
  children: ReactElement | null;
};

export interface StringColorProps {
  id?: string;
  label?: string;
  color?: string;
  primary?: string;
  secondary?: string;
}

export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

export interface FormInputProps {
  bug: KeyedObject;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | undefined;
  label: string;
  name: string;
  required?: boolean;
  InputProps?: {
    label: string;
    startAdornment?: React.ReactNode;
  };
}

export type HandleFunction = (i: string, s: string) => Promise<void>;

export type LayoutType = 'authGuard' | 'guestGuard' | 'minimalLayout';
/** ---- Common Functions types ---- */

export type StringBoolFunc = (s: string) => boolean;
export type StringNumFunc = (s: string) => number;
export type NumbColorFunc = (n: number) => StringColorProps | undefined;
export type ChangeEventFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;

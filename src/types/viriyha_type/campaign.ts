import { User_BackendType } from './backend_user';
import { ShopManagementType } from './shop';

export interface CampaignStateProps {
  campaign: CampaignType[];
  error: object | string | null;
}

export type CampaignType = {
  id: number;
  name: string;
  type: string;
  view: number;
  unique_view: number;
  category_type_id: number;
  used_quantity: number;
  quantity: number;
  quantity_category: string;
  quota_quantity_limit: number;
  quota_limit_by: string;
  segment: number[];
  criteria: number[];
  startDate: Date;
  endDate: Date;
  description?: string; // optional
  condition?: string; // optional
  status: 'ACTIVE' | 'INACTIVE'; // สมมติว่า Status มีค่าเป็น 'ACTIVE' หรือ 'INACTIVE'
  createdById: number;
  updatedById?: number; // optional
  createdAt: Date;
  updatedAt: Date;
  shopId: number[];
  branchId: number[];
  pinned?: boolean;
  branch_condition: string;
  quotaRange: CampaignDate;
  Campaign_Image: CampaignImage[]; // ประกาศ type ด้านล่าง
  Campaign_Date: CampaignDate[];
  Campaign_Shop: CampaignShop[];
  Campaign_User: CampaignUser[];
  Campaign_Code: CampaignCode[];
  Campaign_Transaction: CampaignTransaction[];
  createdBy: User_BackendType;
  updatedBy?: User_BackendType;
};

export type CampaignImage = {
  id: number;
  image: string;
  campaignId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignShop = {
  id: number;
  shopId: number;
  campaignId: number;
  createdAt: Date;
  updatedAt: Date;
  Campaign_Shop_Branch: CampaignShopBranch[];
  Shop: ShopManagementType;
};

export type CampaignShopBranch = {
  id: number;
  campaignShopId: number;
  branchId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignUser = {
  id: number;
  campaignId: number;
  userId: number;
};

export type CampaignDate = {
  id: number;
  campaignId: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignCode = {
  id: number;
  code: string;
  campaignId: number;
  usedAt: Date;
  Campaign_Transaction: CampaignTransaction[];
};

export type CampaignTransaction = {
  id: number;
  id_card: string;
  name?: string;
  surname?: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'INACTIVE';
  usedAt: string;
};

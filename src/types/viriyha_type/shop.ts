import { UserType } from './users';

export interface ShopStateProps {
  shop: ShopManagementType[];
  error: object | string | null;
}

export type ShopManagementType = {
  id: string;
  shopId: number;
  image: string;
  name: string;
  description: string;
  address: string;
  status: string;
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserType;
};
